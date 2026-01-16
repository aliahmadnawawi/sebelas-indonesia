import { PaymentProvider } from "../payment.provider";

export class TripayProvider implements PaymentProvider {
  code = "tripay";

  async getPaymentMethods() {
    return [
      { code: "QRIS", name: "QRIS" },
      { code: "VIRTUAL_ACCOUNT", name: "Virtual Account" },
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
      invoiceId: `tripay-${method.toLowerCase()}-${payload.orderId}`,
      raw: { placeholder: true, method },
    };
  }

  verifyWebhook() {
    return true;
  }

  getWebhookEventId(payload: any) {
    return payload?.reference || payload?.invoice_id || payload?.order_id || "tripay";
  }

  async handleWebhook(payload: any) {
    return {
      invoiceId: payload.reference || payload.invoice_id,
      status: payload.status || "PENDING",
      raw: payload,
    };
  }
}
