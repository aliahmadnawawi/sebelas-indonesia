import { PaymentProvider } from "../payment.provider";

export class MockPaymentProvider implements PaymentProvider {
  code = "mock";

  async getPaymentMethods() {
    return [
      { code: "MOCK", name: "Mock Payment" },
      { code: "QRIS", name: "QRIS" },
    ];
  }

  async createInvoice(payload: {
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
  }) {
    const method = payload.paymentMethod || "MOCK";
    return {
      invoiceId: `mock-${method.toLowerCase()}-${payload.orderId}`,
      paymentUrl: `https://mock.pay/sebelas/${payload.orderId}?method=${method}`,
      raw: { mock: true, method },
    };
  }

  verifyWebhook() {
    return true;
  }

  getWebhookEventId(payload: any) {
    return payload?.eventId || payload?.invoiceId || payload?.orderId || "mock";
  }

  async handleWebhook(payload: any) {
    return {
      invoiceId: payload.invoiceId,
      status: payload.status || "PAID",
      raw: payload,
    };
  }
}
