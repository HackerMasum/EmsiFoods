import {
  Check,
  Circle,
  Clock3,
  PackageCheck,
  Truck,
} from "lucide-react";

import type {
  CustomerOrderStatus,
} from "../customer-order.types";

type TrackingStep = {
  status: CustomerOrderStatus;
  title: string;
  description: string;
  icon: typeof Circle;
};

type OrderTrackingTimelineProps = {
  status: CustomerOrderStatus;
};

const trackingSteps: TrackingStep[] = [
  {
    status: "PENDING",
    title: "Order Placed",
    description:
      "We've received your order successfully.",
    icon: Clock3,
  },
  {
    status: "CONFIRMED",
    title: "Order Confirmed",
    description:
      "Your order has been confirmed and accepted.",
    icon: Check,
  },
  {
    status: "PROCESSING",
    title: "Preparing Order",
    description:
      "Your items are currently being prepared.",
    icon: PackageCheck,
  },
  {
    status: "SHIPPED",
    title: "On the Way",
    description:
      "Your order has been dispatched for delivery.",
    icon: Truck,
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description:
      "Your order has been delivered successfully.",
    icon: Check,
  },
];

const statusOrder: CustomerOrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export function OrderTrackingTimeline({
  status,
}: OrderTrackingTimelineProps) {
  if (status === "CANCELLED") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-100 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <Circle className="h-5 w-5 fill-current" />
          </div>

          <div>
            <h3 className="font-semibold text-red-900">
              Order Cancelled
            </h3>

            <p className="mt-1 text-sm text-red-700">
              This order was cancelled and will not
              continue through the delivery process.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex =
    statusOrder.indexOf(status);

  return (
    <div className="relative">
      <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-px bg-slate-200" />

      {trackingSteps.map((step, index) => {
        const StepIcon = step.icon;

        const isCompleted =
          index < currentStepIndex;

        const isCurrent =
          index === currentStepIndex;

        const isUpcoming =
          index > currentStepIndex;

        return (
          <div
            key={step.status}
            className="relative flex gap-5 pb-8 last:pb-0"
          >
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                  isCompleted
                    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "",
                  isCurrent
                    ? "border-blue-600 bg-white text-blue-600 shadow-lg shadow-blue-100 ring-4 ring-blue-50"
                    : "",
                  isUpcoming
                    ? "border-slate-200 bg-white text-slate-300"
                    : "",
                ].join(" ")}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>

              {isCurrent && (
                <span className="absolute h-10 w-10 animate-ping rounded-full bg-blue-400 opacity-20" />
              )}
            </div>

            <div
              className={[
                "flex-1 rounded-xl border px-4 py-3 transition-all duration-300",
                isCompleted
                  ? "border-blue-100 bg-blue-50/60"
                  : "",
                isCurrent
                  ? "border-blue-200 bg-white shadow-md shadow-blue-100"
                  : "",
                isUpcoming
                  ? "border-slate-100 bg-slate-50/50"
                  : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <h4
                  className={[
                    "font-semibold",
                    isCompleted || isCurrent
                      ? "text-slate-900"
                      : "text-slate-400",
                  ].join(" ")}
                >
                  {step.title}
                </h4>

                {isCurrent && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                    Current
                  </span>
                )}
              </div>

              <p
                className={[
                  "mt-1.5 text-sm leading-6",
                  isCompleted || isCurrent
                    ? "text-slate-600"
                    : "text-slate-400",
                ].join(" ")}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}