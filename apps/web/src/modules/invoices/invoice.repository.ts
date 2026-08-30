import { prisma } from "@/lib/prisma";

export const invoiceRepository = {
  async findOrderForInvoice(orderId: string) {
    return prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });
  },

  async getStoreSettings() {
    return prisma.storeSettings.findFirst();
  },
};