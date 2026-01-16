import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException("Email already registered");
    }
    const tenant = await this.prisma.tenant.create({
      data: { name: dto.tenantName },
    });
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        tenantId: tenant.id,
        role: "OWNER",
      },
    });
    return this.issueTokens(user.id, user.tenantId, user.role, user.email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });
    if (!user) {
      return null;
    }
    if (user.tenant.status !== "ACTIVE") {
      return null;
    }
    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) {
      return null;
    }
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.issueTokens(user.id, user.tenantId, user.role, user.email);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });
      const tokenEntry = await this.prisma.refreshToken.findFirst({
        where: {
          userId: payload.sub,
          revokedAt: null,
        },
        orderBy: { expiresAt: "desc" },
      });
      if (!tokenEntry) {
        throw new UnauthorizedException("Refresh token revoked");
      }
      if (tokenEntry.expiresAt < new Date()) {
        throw new UnauthorizedException("Refresh token expired");
      }
      const isMatch = await argon2.verify(tokenEntry.tokenHash, refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException("Invalid refresh token");
      }
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      return this.issueTokens(user.id, user.tenantId, user.role, user.email);
    } catch (err) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  private async issueTokens(
    userId: string,
    tenantId: string,
    role: string,
    email: string
  ) {
    const accessTtl = this.configService.get<string>("JWT_ACCESS_TTL") || "15m";
    const refreshTtl =
      this.configService.get<string>("JWT_REFRESH_TTL") || "30d";
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, tenantId, role, email },
      {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        expiresIn: accessTtl,
      }
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: refreshTtl,
      }
    );
    const tokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date(Date.now() + this.parseTtlMs(refreshTtl));
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  private parseTtlMs(ttl: string) {
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 30 * 24 * 60 * 60 * 1000;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit] || 1000);
  }
}
