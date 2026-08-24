export type CheckoutInput = {
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  couponCode?: string;
  paymentMethod?: string;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};