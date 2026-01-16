import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CartService } from "../cart/cart.service";

@Injectable()
export class WhatsAppService {
  constructor(private prisma: PrismaService, private cartService: CartService) {}

  async verifyWebhook(verifyToken: string, challenge: string) {
    const channel = await this.prisma.storeChannelWhatsApp.findFirst({
      where: { webhookVerifyToken: verifyToken, status: "ACTIVE" },
    });
    if (!channel) {
      throw new NotFoundException("Verify token not found");
    }
    return challenge;
  }

  async handleWebhook(payload: any) {
    const changes = payload?.entry?.[0]?.changes?.[0]?.value;
    const phoneNumberId = changes?.metadata?.phone_number_id;
    if (!phoneNumberId) {
      return { ok: true };
    }
    const channel = await this.prisma.storeChannelWhatsApp.findUnique({
      where: { phoneNumberId },
    });
    if (!channel || channel.status !== "ACTIVE") {
      return { ok: true };
    }
    const messages = changes?.messages || [];
    for (const message of messages) {
      const eventId = `${phoneNumberId}:${message.id}`;
      const existing = await this.prisma.webhookEvent.findUnique({
        where: { eventId },
      });
      if (existing) {
        continue;
      }
      await this.prisma.webhookEvent.create({
        data: { providerCode: "whatsapp", eventId, payload },
      });
      const text = (message.text?.body || "").trim().toLowerCase();
      const from = message.from;
      if (!from) {
        continue;
      }
      if (text === "menu") {
        await this.sendMenu(channel.storeId, channel.tenantId, channel, from);
      } else if (text.startsWith("add ")) {
        const productId = text.replace("add ", "").trim();
        const cart = await this.cartService.getOrCreateChannelCart(
          channel.tenantId,
          channel.storeId,
          "WHATSAPP",
          from
        );
        await this.cartService.addItem(channel.tenantId, channel.storeId, cart.id, {
          cartId: cart.id,
          productId,
          qty: 1,
        });
        await this.sendText(channel, from, "Added to cart.");
      } else if (text === "cart") {
        await this.sendCart(channel.storeId, channel.tenantId, channel, from);
      } else if (text === "checkout") {
        const cart = await this.cartService.getOrCreateChannelCart(
          channel.tenantId,
          channel.storeId,
          "WHATSAPP",
          from
        );
        const provider = await this.resolveProviderCode(channel.tenantId, channel.storeId);
        const checkout = await this.cartService.checkout(
          channel.tenantId,
          channel.storeId,
          cart.id,
          provider,
          "QRIS"
        );
        const paymentUrl = checkout.payment.paymentUrl || "Payment created.";
        await this.sendText(channel, from, `Checkout created. Pay here: ${paymentUrl}`);
      } else {
        await this.sendText(
          channel,
          from,
          "Reply MENU to browse products, CART to view cart, CHECKOUT to pay."
        );
      }
      await this.prisma.webhookEvent.update({
        where: { eventId },
        data: { processedAt: new Date() },
      });
    }
    return { ok: true };
  }

  private async sendMenu(
    storeId: string,
    tenantId: string,
    channel: any,
    to: string
  ) {
    const products = await this.prisma.product.findMany({
      where: { storeId, tenantId, status: "ACTIVE" },
      take: 10,
    });
    if (products.length === 0) {
      await this.sendText(channel, to, "No products available.");
      return;
    }
    const lines = products.map(
      (product) => `• ${product.name} (id: ${product.id})`
    );
    await this.sendText(
      channel,
      to,
      `Products:\n${lines.join("\n")}\nReply: ADD <productId> to add.`
    );
  }

  private async sendCart(
    storeId: string,
    tenantId: string,
    channel: any,
    to: string
  ) {
    const cart = await this.cartService.getOrCreateChannelCart(
      tenantId,
      storeId,
      "WHATSAPP",
      to
    );
    if (!cart.items || cart.items.length === 0) {
      await this.sendText(channel, to, "Cart is empty.");
      return;
    }
    const products = await this.prisma.product.findMany({
      where: { id: { in: cart.items.map((item) => item.productId) } },
    });
    const productMap = new Map(products.map((p) => [p.id, p.name]));
    const lines = cart.items.map(
      (item) => `• ${productMap.get(item.productId) || item.productId} x${item.qty}`
    );
    await this.sendText(channel, to, `Cart:\n${lines.join("\n")}\nType CHECKOUT to pay.`);
  }

  private async resolveProviderCode(tenantId: string, storeId: string) {
    const storeProvider = await this.prisma.storePaymentProvider.findFirst({
      where: { tenantId, storeId, isEnabled: true },
      orderBy: { providerCode: "asc" },
    });
    return storeProvider?.providerCode || "mock";
  }

  private async sendText(channel: any, to: string, body: string) {
    const url = `https://graph.facebook.com/v18.0/${channel.phoneNumberId}/messages`;
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${channel.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });
  }
}
