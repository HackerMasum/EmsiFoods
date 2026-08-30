import type { CustomerOrderStatus } from "../customer-order.types";
import { getOrderStatusLabel } from "../customer-order.utils";

type OrderStatusBadgeProps = {
  status: CustomerOrderStatus;
};

const statusStyles: Record<
  CustomerOrderStatus,
  {
    dot: string;
    badge: string;
    ring: string;
  }
> = {
  PENDING: {
    dot: "bg-blue-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    ring: "ring-blue-100",
  },
  CONFIRMED: {
    dot: "bg-sky-500",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    ring: "ring-sky-100",
  },
  PROCESSING: {
    dot: "bg-indigo-500",
    badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
    ring: "ring-indigo-100",
  },
  SHIPPED: {
    dot: "bg-violet-500",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    ring: "ring-violet-100",
  },
  DELIVERED: {
    dot: "bg-emerald-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-100",
  },
  CANCELLED: {
    dot: "bg-red-500",
    badge: "border-red-200 bg-red-50 text-red-700",
    ring: "ring-red-100",
  },
};

export function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ring-4 transition-all duration-200",
        style.badge,
        style.ring,
      ].join(" ")}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={[
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-40",
            style.dot,
          ].join(" ")}
        />

        <span
          className={[
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            style.dot,
          ].join(" ")}
        />
      </span>

      {getOrderStatusLabel(status)}
    </span>
  );
}