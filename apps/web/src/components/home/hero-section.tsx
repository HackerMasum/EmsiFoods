"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            Authentic Bangladeshi Foods
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Taste the Authentic
            <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Flavors of Bangladesh
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Discover authentic homemade foods, traditional pickles, pure honey,
            dried fish delicacies, and seasonal favorites — delivered fresh to
            your doorstep.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 sm:w-auto"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/categories"
              className="inline-flex w-full items-center justify-center rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 sm:w-auto"
            >
              Explore Categories
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-blue-100 pt-8">
            <div>
              <p className="text-xl font-bold text-slate-900">100%</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Authentic
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-slate-900">Fresh</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Quality Foods
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-slate-900">Fast</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}