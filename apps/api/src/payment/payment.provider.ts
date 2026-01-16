export interface PaymentProvider {
  code: string;
  getPaymentMethods(): Promise<{ code: string; name: string }[]>;
  createInvoice(payload: {
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    config?: Record<string, any> | null;
  }): Promise<{ invoiceId: string; paymentUrl?: string; raw?: unknown }>;
  verifyWebhook(payload: any, headers: Record<string, string>): boolean;
  getWebhookEventId(payload: any): string;
  handleWebhook(payload: any): Promise<{
    invoiceId: string;
    status: "PAID" | "FAILED" | "EXPIRED" | "PENDING";
    raw?: unknown;
  }>;
}
