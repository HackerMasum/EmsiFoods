import { orderRepository } from "./order.repository";
import type {
  CheckoutInput,
  OrderStatus,
} from "./order.types";

const allowedStatusTransitions: Record<
  OrderStatus,
  OrderStatus[]
> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const orderService = {
  async checkout(data: CheckoutInput) {
    // 1. Find the user's cart
    const cart = await orderRepository.findCartByUserId(
      data.userId
    );

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2. Validate products and stock
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

    // 3. Calculate subtotal
    const subtotal = cart.items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) * item.quantity,
      0
    );

    let discount = 0;
    let validCouponCode: string | undefined;

    // 4. Apply coupon if provided
    if (data.couponCode) {
      const coupon =
        await orderRepository.findCouponByCode(
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
        throw new Error(
          "Coupon usage limit reached"
        );
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
          subtotal *
          (Number(coupon.value) / 100);
      } else {
        discount = Number(coupon.value);
      }

      // Prevent discount from exceeding subtotal
      discount = Math.min(discount, subtotal);

      validCouponCode = coupon.code;
    }

    // 5. Calculate final total
    const total = subtotal - discount;

    // 6. Generate order number
    const orderNumber = `EMSI-${Date.now()}`;

    // 7. Atomic checkout transaction
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

  async getOrdersByUserId(userId: string) {
    return orderRepository.getOrdersByUserId(
      userId
    );
  },

  async getOrderById(orderId: string) {
    const order =
      await orderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus
  ) {
    const order =
      await orderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const currentStatus =
      order.status as OrderStatus;

    if (currentStatus === newStatus) {
      throw new Error(
        `Order is already ${newStatus}`
      );
    }

    const allowedTransitions =
      allowedStatusTransitions[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Cannot change order status from ${currentStatus} to ${newStatus}`
      );
    }

    // Use cancellation transaction so stock is restored
    if (newStatus === "CANCELLED") {
      return orderRepository.cancelOrder(orderId);
    }

    return orderRepository.updateOrderStatus(
      orderId,
      newStatus
    );
  },
};