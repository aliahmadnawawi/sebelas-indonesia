import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { SuperAdminGuard } from "../common/guards/superadmin.guard";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller("admin")
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get("tenants")
  listTenants() {
    return this.prisma.tenant.findMany({ include: { stores: true, users: true } });
  }

  @Patch("tenants/:id")
  updateTenant(@Param("id") id: string, @Body() body: { status?: string }) {
    return this.prisma.tenant.update({
      where: { id },
      data: { status: body.status },
    });
  }

  @Get("stores")
  listStores() {
    return this.prisma.store.findMany({ include: { tenant: true } });
  }

  @Post("stores")
  createStore(@Body() body: { tenantId: string; name: string; slug: string }) {
    const reserved = new Set(["admin", "api", "www", "mail", "smtp", "ftp", "cdn"]);
    const slug = body.slug.toLowerCase();
    if (reserved.has(slug)) {
      throw new BadRequestException("Slug is reserved");
    }
    return this.prisma.store.create({
      data: {
        tenantId: body.tenantId,
        name: body.name,
        slug,
      },
    });
  }

  @Patch("stores/:id")
  updateStore(@Param("id") id: string, @Body() body: { name?: string; status?: string }) {
    return this.prisma.store.update({
      where: { id },
      data: { name: body.name, status: body.status },
    });
  }

  @Get("stores/:id/products")
  listProducts(@Param("id") storeId: string) {
    return this.prisma.product.findMany({ where: { storeId } });
  }

  @Post("stores/:id/products")
  async createProduct(
    @Param("id") storeId: string,
    @Body()
    body: {
      tenantId: string;
      name: string;
      slug: string;
      description?: string;
      currency: string;
      amount: number;
      sku?: string;
      stockQty?: number;
    }
  ) {
    const product = await this.prisma.product.create({
      data: {
        tenantId: body.tenantId,
        storeId,
        name: body.name,
        slug: body.slug,
        description: body.description,
      },
    });
    await this.prisma.price.create({
      data: {
        tenantId: body.tenantId,
        productId: product.id,
        currency: body.currency,
        amount: body.amount,
      },
    });
    await this.prisma.inventory.create({
      data: {
        tenantId: body.tenantId,
        productId: product.id,
        sku: body.sku || `SKU-${product.slug}`.toUpperCase(),
        stockQty: body.stockQty ?? 0,
      },
    });
    return product;
  }

  @Patch("stores/:id/products/:productId")
  updateProduct(
    @Param("productId") productId: string,
    @Body() body: { name?: string; description?: string; status?: string }
  ) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { name: body.name, description: body.description, status: body.status },
    });
  }

  @Patch("stores/:id/products/:productId/stock")
  updateProductStock(@Param("productId") productId: string, @Body() body: { stockQty: number }) {
    return this.prisma.inventory.update({
      where: { productId },
      data: { stockQty: body.stockQty },
    });
  }

  @Patch("stores/:id/products/:productId/price")
  updateProductPrice(
    @Param("productId") productId: string,
    @Body() body: { amount: number }
  ) {
    return this.prisma.price.updateMany({
      where: { productId },
      data: { amount: body.amount },
    });
  }

  @Get("stores/:id/telegram-bots")
  listTelegram(@Param("id") storeId: string) {
    return this.prisma.storeChannelTelegram.findMany({ where: { storeId } });
  }

  @Post("stores/:id/telegram-bots")
  async addTelegram(@Param("id") storeId: string, @Body() body: { tenantId: string; botToken: string }) {
    return this.prisma.storeChannelTelegram.create({
      data: {
        tenantId: body.tenantId,
        storeId,
        botToken: body.botToken,
      },
    });
  }

  @Patch("stores/:id/telegram-bots/:botId")
  updateTelegram(@Param("botId") botId: string, @Body() body: { status?: string }) {
    return this.prisma.storeChannelTelegram.update({
      where: { id: botId },
      data: { status: body.status },
    });
  }

  @Get("stores/:id/whatsapp-channels")
  listWhatsApp(@Param("id") storeId: string) {
    return this.prisma.storeChannelWhatsApp.findMany({ where: { storeId } });
  }

  @Post("stores/:id/whatsapp-channels")
  addWhatsApp(
    @Param("id") storeId: string,
    @Body()
    body: {
      tenantId: string;
      phoneNumberId: string;
      wabaId: string;
      accessToken: string;
      webhookVerifyToken: string;
    }
  ) {
    return this.prisma.storeChannelWhatsApp.create({
      data: {
        tenantId: body.tenantId,
        storeId,
        phoneNumberId: body.phoneNumberId,
        wabaId: body.wabaId,
        accessToken: body.accessToken,
        webhookVerifyToken: body.webhookVerifyToken,
      },
    });
  }

  @Patch("stores/:id/whatsapp-channels/:channelId")
  updateWhatsApp(@Param("channelId") channelId: string, @Body() body: { status?: string }) {
    return this.prisma.storeChannelWhatsApp.update({
      where: { id: channelId },
      data: { status: body.status },
    });
  }

  @Get("stores/:id/payment-providers")
  listStoreProviders(@Param("id") storeId: string) {
    return this.prisma.storePaymentProvider.findMany({ where: { storeId } });
  }

  @Patch("stores/:id/payment-providers/:code")
  updateStoreProvider(
    @Param("id") storeId: string,
    @Param("code") code: string,
    @Body() body: { tenantId: string; isEnabled?: boolean; config?: any }
  ) {
    return this.prisma.storePaymentProvider.upsert({
      where: {
        tenantId_storeId_providerCode: {
          tenantId: body.tenantId,
          storeId,
          providerCode: code,
        },
      },
      update: { isEnabled: body.isEnabled, config: body.config },
      create: {
        tenantId: body.tenantId,
        storeId,
        providerCode: code,
        isEnabled: body.isEnabled ?? true,
        config: body.config ?? {},
      },
    });
  }

  @Get("users")
  listUsers() {
    return this.prisma.user.findMany({ include: { tenant: true } });
  }

  @Get("payment-providers")
  listPaymentProviders() {
    return this.prisma.paymentProvider.findMany();
  }

  @Patch("payment-providers/:code")
  updatePaymentProvider(
    @Param("code") code: string,
    @Body() body: { isEnabled?: boolean; config?: any }
  ) {
    return this.prisma.paymentProvider.upsert({
      where: { code },
      update: { isEnabled: body.isEnabled, config: body.config },
      create: { code, isEnabled: body.isEnabled ?? true, config: body.config ?? {} },
    });
  }
}
