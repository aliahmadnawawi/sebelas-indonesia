import { PaymentProvider } from "../payment.provider";

export class SaweriaProvider implements PaymentProvider {
  code = "saweria";

  async getPaymentMethods() {
    return [
      { code: "QRIS", name: "QRIS" },
      { code: "TRANSFER", name: "Bank Transfer" },
    ];
  }

  async createInvoice(payload: {
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    config?: Record<string, any> | null;
  }) {
    const method = (payload.paymentMethod || "QRIS").toUpperCase();
    return {
      invoiceId: `saweria-${method.toLowerCase()}-${payload.orderId}`,
      raw: { placeholder: true, method },
    };
  }

  verifyWebhook() {
    return true;
  }

  getWebhookEventId(payload: any) {
    return payload?.id || payload?.order_id || "saweria";
  }

  async handleWebhook(payload: any) {
    return {
      invoiceId: payload.id,
      status: payload.status || "PENDING",
      raw: payload,
    };
  }
}
