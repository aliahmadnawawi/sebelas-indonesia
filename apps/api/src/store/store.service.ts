import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { AddTelegramDto } from "./dto/add-telegram.dto";
import { AddWhatsAppDto } from "./dto/add-whatsapp.dto";

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "www",
  "mail",
  "smtp",
  "ftp",
  "cdn",
]);

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateStoreDto) {
    const slug = dto.slug.toLowerCase();
    if (RESERVED_SLUGS.has(slug)) {
      throw new BadRequestException("Slug is reserved");
    }
    const existing = await this.prisma.store.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException("Slug already used");
    }
    return this.prisma.store.create({
      data: {
        tenantId,
        name: dto.name,
        slug,
      },
    });
  }

  async list(tenantId: string) {
    return this.prisma.store.findMany({ where: { tenantId } });
  }

  async getById(tenantId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: { id: storeId, tenantId },
    });
    if (!store) {
      throw new NotFoundException("Store not found");
    }
    return store;
  }

  async update(tenantId: string, storeId: string, dto: UpdateStoreDto) {
    await this.getById(tenantId, storeId);
    return this.prisma.store.update({
      where: { id: storeId },
      data: dto,
    });
  }

  async getBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({ where: { slug } });
    if (!store) {
      throw new NotFoundException("Store not found");
    }
    return store;
  }

  async addTelegramBot(tenantId: string, storeId: string, dto: AddTelegramDto) {
    await this.getById(tenantId, storeId);
    if (!dto.botToken.includes(":")) {
      throw new BadRequestException("Invalid Telegram bot token");
    }
    return this.prisma.storeChannelTelegram.create({
      data: {
        tenantId,
        storeId,
        botToken: dto.botToken,
      },
    });
  }

  async listTelegramBots(tenantId: string, storeId: string) {
    return this.prisma.storeChannelTelegram.findMany({
      where: { tenantId, storeId },
    });
  }

  async updateTelegramBot(
    tenantId: string,
    storeId: string,
    botId: string,
    status?: string
  ) {
    await this.getById(tenantId, storeId);
    return this.prisma.storeChannelTelegram.update({
      where: { id: botId },
      data: { status },
    });
  }

  async addWhatsAppChannel(
    tenantId: string,
    storeId: string,
    dto: AddWhatsAppDto
  ) {
    await this.getById(tenantId, storeId);
    return this.prisma.storeChannelWhatsApp.create({
      data: {
        tenantId,
        storeId,
        phoneNumberId: dto.phoneNumberId,
        wabaId: dto.wabaId,
        accessToken: dto.accessToken,
        webhookVerifyToken: dto.webhookVerifyToken,
      },
    });
  }

  async listWhatsAppChannels(tenantId: string, storeId: string) {
    return this.prisma.storeChannelWhatsApp.findMany({
      where: { tenantId, storeId },
    });
  }

  async updateWhatsAppChannel(
    tenantId: string,
    storeId: string,
    channelId: string,
    status?: string
  ) {
    await this.getById(tenantId, storeId);
    return this.prisma.storeChannelWhatsApp.update({
      where: { id: channelId },
      data: { status },
    });
  }
}
