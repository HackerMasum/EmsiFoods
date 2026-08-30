"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  XCircle,
} from "lucide-react";

import type {
  CustomerOrder,
} from "../customer-order.types";

type OrderStatsProps = {
  orders: CustomerOrder[];
};

export function OrderStats({
  orders,
}: OrderStatsProps) {
  const totalOrders = orders.length;

  const activeOrders = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED"].includes(
        order.status
      )
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      description: "All your purchases",
      icon: ClipboardList,
      iconClass:
        "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      description: "Currently in progress",
      icon: PackageCheck,
      iconClass:
        "bg-sky-50 text-sky-600",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      description: "Successfully completed",
      icon: CheckCircle2,
      iconClass:
        "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Cancelled",
      value: cancelledOrders,
      description: "Orders not completed",
      icon: XCircle,
      iconClass:
        "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
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
              delay: index * 0.06,
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </div>

              <div
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110",
                  stat.iconClass,
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              {stat.description}
            </p>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
          </motion.div>
        );
      })}
    </div>
  );
}