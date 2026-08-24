import { orderRepository } from "./order.repository";
import type {
  CheckoutInput,
  UpdateOrderStatusInput,
} from "./order.types";

export const orderService = {
  async checkout(data: CheckoutInput) {
    const cart = await orderRepository.findCartByUserId(
      data.userId
    );

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new Error(
          `${item.product.name} is no longer available`
        );
      }

      if (item.product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.product.name}`
        );
      }
    }

    const subtotal = cart.items.reduce(
      (total, item) =>
        total + Number(item.product.price) * item.quantity,
      0
    );

    let discount = 0;
    let validCouponCode: string | undefined;

    if (data.couponCode) {
      const coupon = await orderRepository.findCouponByCode(
        data.couponCode
      );

      if (!coupon) {
        throw new Error("Invalid coupon");
      }

      if (!coupon.isActive) {
        throw new Error("Coupon is not active");
      }

      if (
        coupon.expiresAt &&
        coupon.expiresAt < new Date()
      ) {
        throw new Error("Coupon has expired");
      }

      if (
        coupon.maxUses !== null &&
        coupon.usedCount >= coupon.maxUses
      ) {
        throw new Error("Coupon usage limit reached");
      }

      if (
        coupon.minOrder !== null &&
        subtotal < Number(coupon.minOrder)
      ) {
        throw new Error(
          `Minimum order amount is ${coupon.minOrder}`
        );
      }

      if (coupon.type === "PERCENTAGE") {
        discount =
          subtotal * (Number(coupon.value) / 100);
      } else {
        discount = Number(coupon.value);
      }

      discount = Math.min(discount, subtotal);

      validCouponCode = coupon.code;
    }

    const total = subtotal - discount;

    const orderNumber = `EMSI-${Date.now()}`;

    const order = await orderRepository.checkout(
      cart.id,
      {
        ...data,
        orderNumber,
        subtotal,
        discount,
        total,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.product.price),
        })),
        couponCode: validCouponCode,
      },
      validCouponCode
    );

    return order;
  },

  async getOrderById(orderId: string) {
    const order = await orderRepository.getOrderById(
      orderId
    );

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  },

  async getOrders(userId?: string) {
    if (userId) {
      return orderRepository.getOrdersByUserId(userId);
    }

    return orderRepository.getAllOrders();
  },

  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusInput
  ) {
    await this.getOrderById(orderId);

    return orderRepository.updateOrderStatus(
      orderId,
      data.status
    );
  },
};