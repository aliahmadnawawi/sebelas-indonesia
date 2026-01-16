import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { PaymentProvider } from "./payment.provider";
import { MockPaymentProvider } from "./providers/mock.provider";
import { TripayProvider } from "./providers/tripay.provider";
import { PakasirProvider } from "./providers/pakasir.provider";
import { SaweriaProvider } from "./providers/saweria.provider";
import { createPaymentQueue } from "./payment.queue";

@Injectable()
export class PaymentService {
  private providers: Map<string, PaymentProvider>;
  private queue;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    this.providers = new Map(
      [
        new MockPaymentProvider(),
        new TripayProvider(),
        new PakasirProvider(),
        new SaweriaProvider(),
      ].map((provider) => [provider.code, provider])
    );
    this.queue = createPaymentQueue(configService);
  }

  async getAvailableProviders() {
    const dbProviders = await this.prisma.paymentProvider.findMany();
    if (dbProviders.length === 0) {
      return [{ code: "mock", isEnabled: true }];
    }
    return dbProviders;
  }

  async createInvoice(
    tenantId: string,
    orderId: string,
    providerCode: string,
    paymentMethod?: string
  ) {
    const selectedCode =
      providerCode || this.configService.get<string>("PAYMENT_PROVIDER_DEFAULT") || "mock";
    const provider = this.providers.get(selectedCode);
    if (!provider) {
      throw new BadRequestException("Payment provider not supported");
    }
    const enabled = await this.prisma.paymentProvider.findUnique({
      where: { code: selectedCode },
    });
    if (enabled && !enabled.isEnabled) {
      throw new BadRequestException("Payment provider disabled");
    }
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
    });
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    const invoice = await provider.createInvoice({
      orderId: order.id,
      amount: order.totalAmount,
      currency: order.currency,
      paymentMethod,
    });
    const payment = await this.prisma.payment.create({
      data: {
        tenantId,
        orderId: order.id,
        providerCode: selectedCode,
        status: "PENDING",
        invoiceId: invoice.invoiceId,
        rawResponse: invoice.raw || {},
      },
    });
    return { payment, paymentUrl: invoice.paymentUrl };
  }

  async enqueueWebhook(providerCode: string, payload: any, headers: any) {
    const provider = this.providers.get(providerCode);
    if (!provider) {
      throw new BadRequestException("Unsupported provider");
    }
    if (!provider.verifyWebhook(payload, headers)) {
      throw new BadRequestException("Invalid signature");
    }
    const eventId = provider.getWebhookEventId(payload);
    if (!eventId) {
      throw new BadRequestException("Missing event id");
    }
    const existing = await this.prisma.webhookEvent.findUnique({
      where: { eventId },
    });
    if (existing) {
      return { received: true, duplicate: true };
    }
    await this.prisma.webhookEvent.create({
      data: {
        providerCode,
        eventId,
        payload,
      },
    });
    await this.queue.add(
      "process",
      { providerCode, payload, eventId },
      { attempts: 5, backoff: { type: "exponential", delay: 5000 } }
    );
    return { received: true };
  }

  async processWebhookJob(data: { providerCode: string; payload: any; eventId: string }) {
    const provider = this.providers.get(data.providerCode);
    if (!provider) {
      throw new BadRequestException("Unsupported provider");
    }
    const result = await provider.handleWebhook(data.payload);
    const payment = await this.prisma.payment.findFirst({
      where: { invoiceId: result.invoiceId, providerCode: data.providerCode },
      include: { order: true },
    });
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: result.status,
        rawResponse: result.raw || {},
      },
    });
    if (result.status === "PAID") {
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" },
      });
    } else if (result.status === "FAILED" || result.status === "EXPIRED") {
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "CANCELLED" },
      });
    }
    await this.prisma.webhookEvent.update({
      where: { eventId: data.eventId },
      data: { processedAt: new Date() },
    });
  }
}
