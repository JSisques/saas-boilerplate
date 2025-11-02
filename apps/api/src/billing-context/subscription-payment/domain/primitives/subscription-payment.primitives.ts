export type PaymentPrimitives = {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  invoiceNumber: string;
  stripeInvoiceId: string;
  paidAt: Date;
};
