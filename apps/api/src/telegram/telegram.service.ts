import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CartService } from "../cart/cart.service";

@Injectable()
export class TelegramService {
  constructor(private prisma: PrismaService, private cartService: CartService) {}

  async handleUpdate(botToken: string, update: any) {
    const channel = await this.prisma.storeChannelTelegram.findUnique({
      where: { botToken },
    });
    if (!channel || channel.status !== "ACTIVE") {
      throw new NotFoundException("Telegram bot not registered");
    }
    const eventId = `${botToken}:${update.update_id}`;
    const existing = await this.prisma.webhookEvent.findUnique({
      where: { eventId },
    });
    if (existing) {
      return { ok: true, duplicate: true };
    }
    await this.prisma.webhookEvent.create({
      data: { providerCode: "telegram", eventId, payload: update },
    });

    const message = update.message || update.callback_query?.message;
    const chatId = message?.chat?.id?.toString();
    if (!chatId) {
      return { ok: true };
    }
    const textRaw =
      update.message?.text ||
      update.callback_query?.data ||
      "";
    const text = textRaw.toUpperCase();

    try {
    if (text.startsWith("/START")) {
        await this.sendMessage(botToken, chatId, "Welcome to Sebelas Storefront!", {
          inline_keyboard: [[{ text: "Menu", callback_data: "MENU" }]],
        });
        return { ok: true };
      }

      if (text === "MENU") {
        await this.sendMenu(channel.storeId, channel.tenantId, botToken, chatId);
        return { ok: true };
      }

    if (text.startsWith("ADD:")) {
        const productId = text.replace("ADD:", "");
        const cart = await this.cartService.getOrCreateChannelCart(
          channel.tenantId,
          channel.storeId,
          "TELEGRAM",
          chatId
        );
        await this.cartService.addItem(channel.tenantId, channel.storeId, cart.id, {
          cartId: cart.id,
          productId,
          qty: 1,
        });
        await this.sendMessage(botToken, chatId, "Added to cart.");
        return { ok: true };
      }

    if (text === "CART") {
        await this.sendCart(channel.storeId, channel.tenantId, botToken, chatId);
        return { ok: true };
      }

    if (text === "CHECKOUT") {
        const cart = await this.cartService.getOrCreateChannelCart(
          channel.tenantId,
          channel.storeId,
          "TELEGRAM",
          chatId
        );
        const paymentProvider = await this.resolveProviderCode(
          channel.tenantId,
          channel.storeId
        );
        const checkout = await this.cartService.checkout(
          channel.tenantId,
          channel.storeId,
          cart.id,
          paymentProvider,
          "QRIS"
        );
        const paymentUrl = checkout.payment.paymentUrl || "Payment created.";
        await this.sendMessage(
          botToken,
          chatId,
          `Checkout created. Pay here: ${paymentUrl}`
        );
        return { ok: true };
      }

      await this.sendMessage(botToken, chatId, "Type MENU to browse products.");
      return { ok: true };
    } finally {
      await this.prisma.webhookEvent.update({
        where: { eventId },
        data: { processedAt: new Date() },
      });
    }
  }

  private async sendMenu(
    storeId: string,
    tenantId: string,
    botToken: string,
    chatId: string
  ) {
    const products = await this.prisma.product.findMany({
      where: { storeId, tenantId, status: "ACTIVE" },
      take: 10,
    });
    if (products.length === 0) {
      await this.sendMessage(botToken, chatId, "No products available.");
      return;
    }
    const keyboard = products.map((product) => [
      { text: `${product.name}`, callback_data: `ADD:${product.id}` },
    ]);
    await this.sendMessage(botToken, chatId, "Choose a product:", {
      inline_keyboard: keyboard,
    });
    await this.sendMessage(botToken, chatId, "Type CART to view cart.");
  }

  private async sendCart(
    storeId: string,
    tenantId: string,
    botToken: string,
    chatId: string
  ) {
    const cart = await this.cartService.getOrCreateChannelCart(
      tenantId,
      storeId,
      "TELEGRAM",
      chatId
    );
    if (!cart.items || cart.items.length === 0) {
      await this.sendMessage(botToken, chatId, "Cart is empty.");
      return;
    }
    const products = await this.prisma.product.findMany({
      where: { id: { in: cart.items.map((item) => item.productId) } },
    });
    const productMap = new Map(products.map((p) => [p.id, p.name]));
    const lines = cart.items.map(
      (item) => `• ${productMap.get(item.productId) || item.productId} x${item.qty}`
    );
    await this.sendMessage(botToken, chatId, `Cart:\n${lines.join("\n")}`);
    await this.sendMessage(botToken, chatId, "Type CHECKOUT to pay.");
  }

  private async resolveProviderCode(tenantId: string, storeId: string) {
    const storeProvider = await this.prisma.storePaymentProvider.findFirst({
      where: { tenantId, storeId, isEnabled: true },
      orderBy: { providerCode: "asc" },
    });
    return storeProvider?.providerCode || "mock";
  }

  private async sendMessage(
    botToken: string,
    chatId: string,
    text: string,
    replyMarkup?: Record<string, any>
  ) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: replyMarkup,
      }),
    });
  }
}
