export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "BKASH"
  | "NAGAD"
  | "CARD";

export type CheckoutInput = {
  userId: string;

  customerName: string;
  phone: string;
  address: string;

  paymentMethod?: PaymentMethod;
  couponCode?: string;
};

export type GetOrdersQuery = {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};

export type CancelOrderInput = {
  reason: string;
};