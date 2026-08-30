"use client";

import { motion } from "framer-motion";
import type { CustomerOrder } from "../customer-order.types";
import { OrderCard } from "./order-card";
import { OrderEmptyState } from "./order-empty-state";

type OrderHistoryProps = {
  orders: CustomerOrder[];
  totalOrders: number;
  onClearFilters: () => void;
};

export function OrderHistory({
  orders,
  totalOrders,
  onClearFilters,
}: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <OrderEmptyState
        totalOrders={totalOrders}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: index * 0.05,
          }}
        >
          <OrderCard order={order} />
        </motion.div>
      ))}
    </div>
  );
}