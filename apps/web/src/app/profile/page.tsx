"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Package,
  Save,
  User,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
} from "@/features/profile/profile.api";

import type {
  UpdateProfileInput,
  UserProfile,
} from "@/features/profile/profile.types";

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await getProfile(token);

        setProfile(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setAddress(data.address ?? "");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load profile";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const data: UpdateProfileInput = {
        name,
        phone,
        address,
      };

      const updatedProfile =
        await updateProfile(data, token);

      setProfile(updatedProfile);

      setSuccessMessage(
        "Profile updated successfully"
      );

      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update profile";

      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-medium">
              Loading profile...
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">
              Unable to load profile
            </h1>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Profile Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <User className="h-10 w-10 text-blue-600" />
              </div>

              <h1 className="mt-4 text-xl font-bold text-slate-900">
                {profile?.name || "EmsiFoods Customer"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {profile?.email}
              </p>

              <span className="mt-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {profile?.role}
              </span>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <Link
                href="/orders"
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <Package className="h-5 w-5" />
                My Orders
              </Link>
            </div>
          </aside>

          {/* Profile Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Profile Information
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Update your personal information and
                contact details.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Email address cannot currently be changed.
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  rows={4}
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Enter your delivery address"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Package className="h-4 w-4" />
                  View Orders
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}