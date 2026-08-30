"use client";

import type { CustomerOrder } from "../customer-order.types";
import {
  formatCurrency,
  formatOrderDate,
  getPaymentStatusLabel,
} from "../customer-order.utils";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderTrackingTimeline } from "./order-tracking-timeline";

type OrderDetailsProps = {
  order: CustomerOrder;
};

export function OrderDetails({
  order,
}: OrderDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Order overview */}
      <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Blue decorative background */}
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Order overview
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                Order number
              </p>

              <h2 className="mt-1 break-all text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                {order.orderNumber}
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Placed on{" "}
                <span className="font-medium text-gray-700">
                  {formatOrderDate(order.createdAt)}
                </span>
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </section>

      {/* Order tracking */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v9l6 3"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-950">
            Order tracking
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Follow the progress of your order from placement to delivery.
          </p>
        </div>

        <OrderTrackingTimeline status={order.status} />
      </section>

      {/* Order items */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-950">
              Order items
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {order.items.length}{" "}
              {order.items.length === 1
                ? "item"
                : "items"}{" "}
              in this order
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {order.items.length} items
          </span>
        </div>

        <div className="mt-6 divide-y divide-gray-100">
          {order.items.map((item) => {
            const price = Number(item.price);
            const itemTotal = price * item.quantity;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {item.product.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatCurrency(price)} × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-base font-bold text-gray-950">
                  {formatCurrency(itemTotal)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Delivery and payment */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Delivery information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 10h16M4 14h10M4 18h7"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-950">
            Delivery information
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Customer name
              </p>

              <p className="mt-1.5 font-medium text-gray-900">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Phone
              </p>

              <p className="mt-1.5 font-medium text-gray-900">
                {order.phone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Delivery address
              </p>

              <p className="mt-1.5 leading-relaxed font-medium text-gray-900">
                {order.address}
              </p>
            </div>
          </div>
        </section>

        {/* Payment information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />

              <path
                strokeLinecap="round"
                d="M3 10h18"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-950">
            Payment information
          </h2>

          {order.payment ? (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Payment method
                </p>

                <p className="mt-1.5 font-medium text-gray-900">
                  {order.payment.method ?? "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Payment status
                </p>

                <p className="mt-1.5 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">
                  {getPaymentStatusLabel(
                    order.payment.status
                  )}
                </p>
              </div>

              {order.payment.transactionId && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Transaction ID
                  </p>

                  <p className="mt-1.5 break-all font-mono text-sm font-medium text-gray-900">
                    {order.payment.transactionId}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Payment information is not available yet.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Order summary */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-gray-950">
            Order summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A complete breakdown of your order amount.
          </p>
        </div>

        <div className="mt-6 max-w-xl space-y-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-semibold text-gray-900">
              {formatCurrency(
                Number(order.subtotal)
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-500">
              Discount
            </span>

            <span className="font-semibold text-gray-900">
              -{formatCurrency(
                Number(order.discount)
              )}
            </span>
          </div>

          {order.couponCode && (
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-500">
                Coupon
              </span>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {order.couponCode}
              </span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-bold text-gray-950">
                Total
              </span>

              <span className="text-2xl font-bold tracking-tight text-blue-600">
                {formatCurrency(
                  Number(order.total)
                )}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}