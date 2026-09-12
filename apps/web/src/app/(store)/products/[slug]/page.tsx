import Image from "next/image";
import Link from "next/link";
import {
ArrowLeft,
CheckCircle2,
Package,
ShieldCheck,
Truck,
} from "lucide-react";

import { productService } from "@/modules/products/product.service";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

type ProductDetailsPageProps = {
params: Promise<{
slug: string;
}>;
};

export default async function ProductDetailsPage({
params,
}: ProductDetailsPageProps) {
const { slug } = await params;

let product;

try {
product = await productService.getProductBySlug(slug);
} catch {
return ( <main className="min-h-screen bg-slate-50 px-4 py-16"> <div className="mx-auto max-w-3xl text-center"> <Package className="mx-auto mb-4 h-14 w-14 text-slate-400" />


      <h1 className="text-2xl font-bold text-slate-900">
        Product not found
      </h1>

      <p className="mt-3 text-slate-600">
        The product you are looking for does not exist or may
        have been removed.
      </p>

      <Link
        href="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>
    </div>
  </main>
);


}

const price = Number(product.price);
const isInStock = product.stock > 0;

return ( <main className="min-h-screen bg-slate-50"> <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
{/* Back navigation */} <Link
       href="/products"
       className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
     > <ArrowLeft className="h-4 w-4" />
Back to Products </Link>


    {/* Product */}
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Product image */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-square w-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-7xl">
              🛒
            </div>
          )}
        </div>
      </div>

      {/* Product information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Category */}
        <Link
          href={`/products?category=${product.category.slug}`}
          className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          {product.category.name}
        </Link>

        {/* Name */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {product.name}
        </h1>

        {/* Price */}
        <div className="mt-6">
          <p className="text-3xl font-bold text-blue-600">
            ৳{price.toFixed(2)}
          </p>
        </div>

        {/* Stock */}
        <div className="mt-5">
          {isInStock ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              In Stock ({product.stock} available)
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Out of Stock
            </div>
          )}
        </div>

        <div className="my-8 border-t border-slate-200" />

        {/* Description */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            Description
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {product.description ||
              "Fresh and high-quality product carefully selected for you."}
          </p>
        </section>

        {/* Add to cart */}
        <div className="mt-8">
          <AddToCartButton
            productId={product.id}
            disabled={!isInStock}
          />
        </div>

        {/* Service highlights */}
        <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Fast Delivery
              </p>
              <p className="text-xs text-slate-500">
                Quick doorstep delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Quality Products
              </p>
              <p className="text-xs text-slate-500">
                Carefully selected foods
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Secure Shopping
              </p>
              <p className="text-xs text-slate-500">
                Safe checkout experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>


);
}
