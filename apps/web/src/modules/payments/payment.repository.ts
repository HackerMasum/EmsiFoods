import { prisma } from "@/lib/prisma";
import type {
  CreatePaymentInput,
  PaymentStatus,
} from "./payment.types";

export const paymentRepository = {
  async findPaymentByOrderId(orderId: string) {
    return prisma.payment.findUnique({
      where: {
        orderId,
      },
      include: {
        order: true,
      },
    });
  },

  async createPayment(data: CreatePaymentInput) {
    return prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        status: "PENDING",
      },
      include: {
        order: true,
      },
    });
  },

  async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
    transactionId?: string
  ) {
    return prisma.payment.update({
      where: {
        orderId,
      },
      data: {
        status,
        ...(transactionId !== undefined
          ? { transactionId }
          : {}),
      },
      include: {
        order: true,
      },
    });
  },
};