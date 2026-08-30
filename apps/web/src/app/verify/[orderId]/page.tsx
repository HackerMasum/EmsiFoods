"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type InvoiceData = {
  invoiceNumber: string;

  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    customerName: string;
    total: string;
  };

  store: {
    storeName: string;
    currency: string;
  };
};

export default function VerifyInvoicePage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const [invoice, setInvoice] =
    useState<InvoiceData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyInvoice() {
      try {
        const response = await fetch(
          `/api/verify-invoice/${orderId}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Invoice verification failed"
          );
        }

        setInvoice(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      verifyInvoice();
    }
  }, [orderId]);

  function formatCurrency(value: string) {
    if (!invoice) return "";

    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: invoice.store.currency || "BDT",
      minimumFractionDigits: 2,
    }).format(Number(value));
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <p className="text-lg font-medium text-black">
          Verifying invoice...
        </p>
      </main>
    );
  }

  if (error || !invoice) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow">
          <h1 className="text-xl font-bold text-red-600">
            Invoice Verification Failed
          </h1>

          <p className="mt-3 text-sm text-black">
            {error || "Invoice not found"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">

        <div className="text-center">
          <p className="text-sm font-semibold text-green-600">
            ✓ VERIFIED INVOICE
          </p>

          <h1 className="mt-3 text-2xl font-bold text-black">
            {invoice.store.storeName}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            This invoice is valid and exists in our system.
          </p>
        </div>

        <div className="my-6 border-t" />

        <div className="space-y-4 text-sm text-black">

          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              Invoice Number
            </span>

            <span className="font-semibold text-right">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              Order Number
            </span>

            <span className="font-semibold text-right">
              {invoice.order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              Order Status
            </span>

            <span className="font-semibold">
              {invoice.order.status}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              Total Amount
            </span>

            <span className="font-bold">
              {formatCurrency(invoice.order.total)}
            </span>
          </div>

        </div>

        <div className="mt-8 border-t pt-5 text-center">
          <p className="text-xs text-gray-500">
            Invoice verification powered by{" "}
            {invoice.store.storeName}
          </p>
        </div>

      </div>
    </main>
  );
}