import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller("me")
export class UserController {
  @Get()
  getProfile(@Req() req: any) {
    return { id: req.user.sub, email: req.user.email, role: req.user.role };
  }
}
