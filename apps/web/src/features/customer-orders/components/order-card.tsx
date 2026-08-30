"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Package,
  ReceiptText,
} from "lucide-react";

import type {
  CustomerOrder,
} from "../customer-order.types";

import {
  formatCurrency,
  formatOrderDate,
} from "../customer-order.utils";

import {
  OrderStatusBadge,
} from "./order-status-badge";

type OrderCardProps = {
  order: CustomerOrder;
};

export function OrderCard({
  order,
}: OrderCardProps) {
  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60">
      {/* Decorative top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 opacity-80" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ReceiptText className="h-4 w-4 text-blue-500" />

              <span>Order Number</span>
            </div>

            <h2 className="mt-2 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {order.orderNumber}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

              <span>
                {formatOrderDate(order.createdAt)}
              </span>
            </div>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        {/* Order items preview */}
        <div className="py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"}
                </p>

                <p className="text-xs text-slate-500">
                  {order.items.length === 1
                    ? order.items[0]?.product.name
                    : `${order.items.length} products in this order`}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {order.status === "DELIVERED"
              ? "Your order has been delivered."
              : order.status === "CANCELLED"
                ? "This order was cancelled."
                : "Track your order status anytime."}
          </p>

          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
          >
            View Details

            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}