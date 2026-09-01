import {
  ArrowUpRight,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Activity,
} from "lucide-react";

const stats = [
  {
    name: "Total Products",
    value: "—",
    description: "Manage your catalog",
    icon: Package,
  },
  {
    name: "Total Orders",
    value: "—",
    description: "Track customer orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    value: "—",
    description: "Registered customers",
    icon: Users,
  },
  {
    name: "Revenue",
    value: "—",
    description: "Total sales revenue",
    icon: DollarSign,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Header */}
      <div className="fade-in mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
            <Activity className="h-3.5 w-3.5" />
            ADMINISTRATION PANEL
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Dashboard Overview
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Monitor your store performance, manage products,
            and keep track of your EmsiFoods business.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
          <Clock className="h-4 w-4 text-blue-600" />
          Live overview
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.name}
              className="slide-up group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/60"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-100/40 blur-2xl transition group-hover:bg-blue-200/60" />

              <div className="relative flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600" />
              </div>

              <p className="relative mt-6 text-sm font-medium text-slate-500">
                {stat.name}
              </p>

              <p className="relative mt-2 text-3xl font-bold tracking-tight text-slate-950">
                {stat.value}
              </p>

              <p className="relative mt-2 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Dashboard content */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        {/* Performance */}
        <div className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-slate-900">
                Store Performance
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Analytics will appear as your store grows.
              </p>
            </div>

            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>

          <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50/70 to-sky-50/70">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>

              <p className="mt-4 font-semibold text-slate-700">
                Analytics coming soon
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sales insights and performance charts will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your store quickly.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href="/admin/products"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Package className="h-5 w-5" />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Manage Products
                </span>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
            </a>

            <a
              href="/admin/orders"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  View Orders
                </span>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
            </a>

            <a
              href="/admin/categories"
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Package className="h-5 w-5" />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Manage Categories
                </span>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
