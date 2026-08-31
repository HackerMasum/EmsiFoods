"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Globe2,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "About",
    href: "/about",
  },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isSearchOpen, setIsSearchOpen] =
    useState(false);

  const [cartCount, setCartCount] =
    useState(0);

  const [isDarkMode, setIsDarkMode] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const token =
      localStorage.getItem("token");

    setIsLoggedIn(Boolean(token));
  }, []);

  useEffect(() => {
    async function fetchCart() {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          setCartCount(0);
          return;
        }

        const response = await fetch(
          "/api/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (
          response.ok &&
          result.success &&
          result.data?.items
        ) {
          const totalItems =
            result.data.items.reduce(
              (
                total: number,
                item: { quantity: number }
              ) => total + item.quantity,
              0
            );

          setCartCount(totalItems);
        }
      } catch {
        setCartCount(0);
      }
    }

    void fetchCart();

    const interval = window.setInterval(
      () => {
        void fetchCart();

        const token =
          localStorage.getItem("token");

        setIsLoggedIn(Boolean(token));
      },
      5000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  function toggleTheme() {
    const newTheme = !isDarkMode;

    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  const accountHref =
    isLoggedIn ? "/profile" : "/login";

  const accountLabel =
    isLoggedIn ? "My Account" : "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg shadow-lg shadow-blue-600/20">
              🍯
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-950">
                EmsiFoods
              </span>

              <span className="text-[10px] font-medium tracking-wide text-slate-500">
                Fresh & Homemade
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Search */}
            <button
              type="button"
              onClick={() =>
                setIsSearchOpen(!isSearchOpen)
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Language - Future */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Language"
              title="Language support coming soon"
            >
              <Globe2 className="h-5 w-5" />
            </button>

            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={accountHref}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <User className="h-4 w-4" />
              {accountLabel}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(
                  !isMobileMenuOpen
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-slate-100 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search delicious foods..."
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-100 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href={accountHref}
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                className="mt-2 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <User className="h-4 w-4" />
                {accountLabel}
              </Link>

              <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                  title="Language support coming soon"
                >
                  <Globe2 className="h-4 w-4" />
                  Language
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}

                  Theme
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}