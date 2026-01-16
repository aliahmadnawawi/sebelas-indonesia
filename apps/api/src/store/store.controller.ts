import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { StoreService } from "./store.service";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { AddTelegramDto } from "./dto/add-telegram.dto";
import { AddWhatsAppDto } from "./dto/add-whatsapp.dto";
import { Public } from "../common/decorators/public.decorator";
import { UpdateChannelDto } from "./dto/update-channel.dto";

@ApiTags("stores")
@Controller("stores")
export class StoreController {
  constructor(private storeService: StoreService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateStoreDto) {
    return this.storeService.create(req.tenantId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get()
  list(@Req() req: any) {
    return this.storeService.list(req.tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get(":id")
  getById(@Req() req: any, @Param("id") id: string) {
    return this.storeService.getById(req.tenantId, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Patch(":id")
  update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateStoreDto) {
    return this.storeService.update(req.tenantId, id, dto);
  }

  @Public()
  @Get("slug/:slug")
  getBySlug(@Param("slug") slug: string) {
    return this.storeService.getBySlug(slug.toLowerCase());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post(":id/telegram-bots")
  addTelegram(@Req() req: any, @Param("id") id: string, @Body() dto: AddTelegramDto) {
    return this.storeService.addTelegramBot(req.tenantId, id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get(":id/telegram-bots")
  listTelegram(@Req() req: any, @Param("id") id: string) {
    return this.storeService.listTelegramBots(req.tenantId, id);
  }

  @Patch(":id/telegram-bots/:botId")
  updateTelegram(
    @Req() req: any,
    @Param("id") id: string,
    @Param("botId") botId: string,
    @Body() dto: UpdateChannelDto
  ) {
    return this.storeService.updateTelegramBot(req.tenantId, id, botId, dto.status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post(":id/whatsapp-channels")
  addWhatsApp(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: AddWhatsAppDto
  ) {
    return this.storeService.addWhatsAppChannel(req.tenantId, id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get(":id/whatsapp-channels")
  listWhatsApp(@Req() req: any, @Param("id") id: string) {
    return this.storeService.listWhatsAppChannels(req.tenantId, id);
  }

  @Patch(":id/whatsapp-channels/:channelId")
  updateWhatsApp(
    @Req() req: any,
    @Param("id") id: string,
    @Param("channelId") channelId: string,
    @Body() dto: UpdateChannelDto
  ) {
    return this.storeService.updateWhatsAppChannel(
      req.tenantId,
      id,
      channelId,
      dto.status
    );
  }
}
