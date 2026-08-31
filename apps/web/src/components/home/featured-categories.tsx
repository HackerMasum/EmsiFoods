import Link from "next/link";
import {
  ArrowRight,
  Beef,
  Fish,
  Grape,
  Package,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "ইলিশের আচার",
    description: "Traditional Hilsa fish pickle",
    icon: Fish,
    href: "/products?category=ilish-achar",
  },
  {
    name: "গরুর মাংসের আচার",
    description: "Authentic beef pickle",
    icon: Beef,
    href: "/products?category=beef-achar",
  },
  {
    name: "আমের আচার",
    description: "Sweet and spicy mango pickle",
    icon: Grape,
    href: "/products?category=mango-achar",
  },
  {
    name: "খাঁটি মধু",
    description: "Pure natural honey",
    icon: Sparkles,
    href: "/products?category=honey",
  },
  {
    name: "চ্যাপা শুটকির ভর্তা",
    description: "Traditional dried fish mash",
    icon: Fish,
    href: "/products?category=chapa-vorta",
  },
  {
    name: "শিদলের ভর্তা",
    description: "Authentic Bengali delicacy",
    icon: Package,
    href: "/products?category=shidol-vorta",
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Explore Our Foods
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-4 max-w-2xl text-slate-600">
              Discover authentic Bangladeshi homemade foods, traditional
              pickles, natural products and delicious local specialties.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}