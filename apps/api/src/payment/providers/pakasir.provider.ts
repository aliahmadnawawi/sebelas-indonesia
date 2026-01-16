import { PaymentProvider } from "../payment.provider";

export class PakasirProvider implements PaymentProvider {
  code = "pakasir";

  async getPaymentMethods() {
    return [
      { code: "QRIS", name: "QRIS" },
      { code: "VA", name: "Virtual Account" },
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
      invoiceId: `pakasir-${method.toLowerCase()}-${payload.orderId}`,
      raw: { placeholder: true, method },
    };
  }

  verifyWebhook() {
    return true;
  }

  getWebhookEventId(payload: any) {
    return payload?.invoice_id || payload?.order_id || "pakasir";
  }

  async handleWebhook(payload: any) {
    return {
      invoiceId: payload.invoice_id,
      status: payload.status || "PENDING",
      raw: payload,
    };
  }
}
