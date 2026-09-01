"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FolderPlus,
  ImagePlus,
  Loader2,
  Save,
  Tag,
} from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
  });

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const name = event.target.value;

    setFormData((previous) => ({
      ...previous,
      name,
      slug: generateSlug(name),
    }));
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Authentication token not found. Please login again."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(
        "/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            description:
              formData.description || undefined,
            image: formData.image || undefined,
            isActive: formData.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create category"
        );
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Back */}
      <Link
        href="/admin/categories"
        className="fade-in inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Link>

      {/* Header */}
      <div className="fade-in mt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
          <FolderPlus className="h-3.5 w-3.5" />
          CATEGORY MANAGEMENT
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Add New Category
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Create a new category to organize your
          EmsiFoods products and improve customer
          browsing.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-6 xl:grid-cols-3"
      >
        {/* Main Form */}
        <div className="space-y-6 xl:col-span-2">
          {/* Basic Information */}
          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20">
                <FolderPlus className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Category Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic details about this category.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Category Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Snacks & Treats"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="slug"
                  className="text-sm font-semibold text-slate-700"
                >
                  Category Slug
                </label>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="snacks-treats"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Used in the category URL.
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what products belong in this category..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <ImagePlus className="h-5 w-5" />
              </div>

              <h2 className="font-bold text-slate-900">
                Category Image
              </h2>
            </div>

            <input
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            {formData.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={formData.image}
                  alt="Category preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Paste a public image URL. Upload support
              can be added later.
            </p>
          </section>

          {/* Status */}
          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Tag className="h-5 w-5" />
              </div>

              <h2 className="font-bold text-slate-900">
                Availability
              </h2>
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Active Category
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Available for product organization
                </p>
              </div>

              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    isActive: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-blue-600"
              />
            </label>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Category...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Category
                </>
              )}
            </button>

            <Link
              href="/admin/categories"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>

          {/* Helper */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

              <p className="text-xs leading-5 text-blue-700">
                Active categories can be used to organize
                products and improve customer browsing.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}