export type CustomerOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type CustomerOrderProduct = {
  id: string;
  name: string;
  price: number | string;
};

export type CustomerOrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number | string;
  product: CustomerOrderProduct;
};

export type CustomerOrderPayment = {
  id: string;
  amount: number | string;
  method: string | null;
  status: PaymentStatus;
  transactionId: string | null;
};

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: CustomerOrderStatus;

  subtotal: number | string;
  discount: number | string;
  total: number | string;

  couponCode: string | null;

  // Cancellation information
  cancellationReason: string | null;
  cancelledAt: string | null;

  customerName: string;
  phone: string;
  address: string;

  userId: string;

  createdAt: string;
  updatedAt: string;

  items: CustomerOrderItem[];
  payment: CustomerOrderPayment | null;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message?: string;
};