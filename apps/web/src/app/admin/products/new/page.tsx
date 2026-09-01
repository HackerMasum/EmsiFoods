"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PackagePlus,
  Save,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    isActive: true,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");

        const result = await response.json();

        if (response.ok && result.success) {
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      } finally {
        setIsLoadingCategories(false);
      }
    }

    void fetchCategories();
  }, []);

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
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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

    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not logged in. Please login again."
        );
      }

      if (!formData.categoryId) {
        throw new Error(
          "Please select a category."
        );
      }

      const response = await fetch("/api/products", {
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
          price: Number(formData.price),
          image: formData.image || undefined,
          categoryId: formData.categoryId,
          isActive: formData.isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create product"
        );
      }

      router.push("/admin/products");
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
      <Link
        href="/admin/products"
        className="fade-in inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="fade-in mt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
          <PackagePlus className="h-3.5 w-3.5" />
          PRODUCT MANAGEMENT
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Add New Product
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Create a new product for your EmsiFoods catalog.
          Add the details, pricing and availability information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-6 xl:grid-cols-3"
      >
        <div className="space-y-6 xl:col-span-2">
          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20">
                <PackagePlus className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic details about your product.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Premium Mango Pickle"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="text-sm font-semibold text-slate-700"
                >
                  Product Slug
                </label>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="premium-mango-pickle"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Used in the product URL.
                </p>
              </div>

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
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your delicious product..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                ৳
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Pricing
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Set the selling price of this product.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <label
                htmlFor="price"
                className="text-sm font-semibold text-slate-700"
              >
                Product Price (BDT)
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ৳
                </span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Tag className="h-5 w-5" />
              </div>

              <h2 className="font-bold text-slate-900">
                Category
              </h2>
            </div>

            <select
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isLoadingCategories}
              className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </section>

          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <ImagePlus className="h-5 w-5" />
              </div>

              <h2 className="font-bold text-slate-900">
                Product Image
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
                  alt="Product preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Paste a public image URL. Image upload support can
              be added later.
            </p>
          </section>

          <section className="slide-up rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="font-bold text-slate-900">
              Availability
            </h2>

            <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Active Product
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Visible to customers
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

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Product
                </>
              )}
            </button>

            <Link
              href="/admin/products"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

              <p className="text-xs leading-5 text-blue-700">
                Products marked as active will be available for
                customers to browse and purchase.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}