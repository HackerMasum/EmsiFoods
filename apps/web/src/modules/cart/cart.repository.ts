import { prisma } from "@/lib/prisma";
import type { AddCartItemInput, UpdateCartItemInput } from "./cart.types";

export const cartRepository = {
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

  async createCart(userId: string) {
    return prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  async findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  },

  async addItem(cartId: string, data: AddCartItemInput) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId: data.productId,
        quantity: data.quantity,
      },
    });
  },

  async updateItem(
    cartId: string,
    productId: string,
    data: UpdateCartItemInput
  ) {
    return prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      data: {
        quantity: data.quantity,
      },
    });
  },

  async deleteItem(cartId: string, productId: string) {
    return prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  },
};