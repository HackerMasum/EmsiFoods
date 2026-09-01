"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Settings,
  ChevronRight,
  Store,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-blue-100/80 bg-white/80 backdrop-blur-xl lg:flex lg:flex-col">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-100/50 to-transparent" />

      {/* Brand */}
      <div className="relative flex h-20 items-center border-b border-blue-100/80 px-6">
        <Link
          href="/admin"
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-xl shadow-lg shadow-blue-500/25 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
            🍯
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              EmsiFoods
            </p>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600">
                Admin Panel
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Management
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  isActive
                    ? "bg-white/15"
                    : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span className="flex-1">
                {item.name}
              </span>

              {isActive && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Store link */}
      <div className="relative border-t border-blue-100/80 p-4">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <Store className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">
              View Store
            </p>

            <p className="text-xs text-slate-400">
              Open storefront
            </p>
          </div>

          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
        </Link>
      </div>
    </aside>
  );
}
