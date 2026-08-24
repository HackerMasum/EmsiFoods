export type CheckoutInput = {
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  couponCode?: string;
  paymentMethod?: string;
};