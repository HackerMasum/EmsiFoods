export type CheckoutInput = {
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  couponCode?: string;
  paymentMethod?: string;
};

export type UpdateOrderStatusInput = {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
};