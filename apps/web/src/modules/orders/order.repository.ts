import { prisma } from "@/lib/prisma";
import type { CheckoutInput } from "./order.types";

type CreateOrderData = CheckoutInput & {
  orderNumber: string;
  subtotal: number;
  discount: number;
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
};

export const orderRepository = {
  async findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  async findCouponByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code },
    });
  },

  async checkout(
    cartId: string,
    data: CreateOrderData,
    couponCode?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: data.orderNumber,
          subtotal: data.subtotal,
          discount: data.discount,
          total: data.total,

          couponCode: data.couponCode,

          customerName: data.customerName,
          phone: data.phone,
          address: data.address,

          userId: data.userId,

          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },

          payment: {
            create: {
              amount: data.total,
              method: data.paymentMethod,
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
      });

      for (const item of data.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      if (couponCode) {
        await tx.coupon.update({
          where: {
            code: couponCode,
          },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          cartId,
        },
      });

      return order;
    });
  },

  async getOrderById(orderId: string) {
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
      },
    });
  },

  async getOrdersByUserId(userId: string) {
    return prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getAllOrders() {
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateOrderStatus(
    orderId: string,
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
  ) {
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });
  },
};