export type PaymentMethod =
  | "COD"
  | "BKASH"
  | "NAGAD"
  | "CARD";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  method: PaymentMethod;
};

export type UpdatePaymentStatusInput = {
  status: PaymentStatus;
  transactionId?: string;
};