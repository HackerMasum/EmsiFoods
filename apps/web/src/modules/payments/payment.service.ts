import { paymentRepository } from "./payment.repository";
import type {
  CreatePaymentInput,
  PaymentStatus,
} from "./payment.types";

const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

const ALLOWED_STATUS_TRANSITIONS: Record<
  PaymentStatus,
  PaymentStatus[]
> = {
  PENDING: ["PAID", "FAILED"],
  PAID: ["REFUNDED"],
  FAILED: [],
  REFUNDED: [],
};

export const paymentService = {
  async getPaymentByOrderId(orderId: string) {
    const payment =
      await paymentRepository.findPaymentByOrderId(
        orderId
      );

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  },

  async createPayment(data: CreatePaymentInput) {
    if (!data.orderId) {
      throw new Error("Order ID is required");
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error(
        "Payment amount must be greater than zero"
      );
    }

    const existingPayment =
      await paymentRepository.findPaymentByOrderId(
        data.orderId
      );

    if (existingPayment) {
      throw new Error(
        "A payment already exists for this order"
      );
    }

    return paymentRepository.createPayment(data);
  },

  async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
    transactionId?: string
  ) {
    if (!VALID_PAYMENT_STATUSES.includes(status)) {
      throw new Error("Invalid payment status");
    }

    const payment =
      await paymentRepository.findPaymentByOrderId(
        orderId
      );

    if (!payment) {
      throw new Error("Payment not found");
    }

    const currentStatus =
      payment.status as PaymentStatus;

    if (currentStatus === status) {
      throw new Error(
        `Payment is already ${status}`
      );
    }

    const allowedTransitions =
      ALLOWED_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(status)) {
      throw new Error(
        `Cannot change payment status from ${currentStatus} to ${status}`
      );
    }

    if (
      transactionId !== undefined &&
      transactionId.trim().length === 0
    ) {
      throw new Error(
        "Transaction ID cannot be empty"
      );
    }

    return paymentRepository.updatePaymentStatus(
      orderId,
      status,
      transactionId
    );
  },
};
