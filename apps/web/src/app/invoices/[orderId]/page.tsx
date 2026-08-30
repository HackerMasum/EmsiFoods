"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

type InvoiceData = {
  invoiceNumber: string;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    customerName: string;
    phone: string;
    address: string;
    subtotal: string;
    discount: string;
    total: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: string;
    total: string;
  }[];
  payment: {
    status: string;
    method: string | null;
    transactionId: string | null;
    amount: string;
  } | null;
  store: {
    storeName: string;
    tagline: string | null;
    description: string | null;
    logo: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    currency: string;
  };
};

export default function InvoicePage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const [invoice, setInvoice] = useState<InvoiceData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `/api/invoices/${orderId}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load invoice"
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
      fetchInvoice();
    }
  }, [orderId]);

  function formatCurrency(value: string | number) {
    if (!invoice) return "";

    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: invoice.store.currency || "BDT",
      minimumFractionDigits: 2,
    }).format(Number(value));
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f4f6] text-black">
        <p className="text-lg font-medium text-black">
          Loading invoice...
        </p>
      </main>
    );
  }

  if (error || !invoice) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f4f6] p-4 text-black">
        <div className="rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-600">
            Unable to Load Invoice
          </h1>

          <p className="mt-2 text-sm text-black">
            {error || "Invoice not found"}
          </p>
        </div>
      </main>
    );
  }

  // QR code points to the PUBLIC invoice verification page
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${orderId}`
      : "";

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          html,
          body {
            background: white !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          .invoice-wrapper {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .invoice-card {
            box-shadow: none !important;
            padding: 0 !important;
          }

          .invoice-header {
            padding-bottom: 16px !important;
          }

          .invoice-info-section {
            padding-top: 18px !important;
            padding-bottom: 18px !important;
          }

          .invoice-item-row td {
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }

          .invoice-totals {
            margin-top: 20px !important;
          }

          .invoice-footer {
            margin-top: 24px !important;
            padding-top: 16px !important;
          }

          .qr-container {
            gap: 8px !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-[#f3f4f6] p-4 text-black md:p-8 print:bg-white print:p-0">
        <div className="invoice-wrapper mx-auto max-w-4xl">
          {/* Print Button */}
          <div className="mb-6 flex justify-end print:hidden">
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#222]"
            >
              Print Invoice
            </button>
          </div>

          {/* Invoice */}
          <div className="invoice-card bg-white p-6 text-black shadow-md md:p-10 print:shadow-none">
            {/* Header */}
            <div className="invoice-header flex flex-col justify-between gap-5 border-b border-black pb-6 md:flex-row">
              {/* Store Information */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-black">
                  {invoice.store.storeName}
                </h1>

                {invoice.store.tagline && (
                  <p className="mt-2 text-sm font-semibold text-black">
                    {invoice.store.tagline}
                  </p>
                )}

                {invoice.store.description && (
                  <p className="mt-1 text-sm text-black">
                    {invoice.store.description}
                  </p>
                )}

                {(invoice.store.phone ||
                  invoice.store.email ||
                  invoice.store.address) && (
                  <div className="mt-3 text-sm text-black">
                    {invoice.store.phone && (
                      <p>{invoice.store.phone}</p>
                    )}

                    {invoice.store.email && (
                      <p>{invoice.store.email}</p>
                    )}

                    {invoice.store.address && (
                      <p>{invoice.store.address}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Invoice Information + QR */}
              <div className="flex flex-col gap-3 text-left md:items-end md:text-right">
                <div>
                  <h2 className="text-2xl font-bold uppercase text-black">
                    Invoice
                  </h2>

                  <div className="mt-2 space-y-1 text-sm text-black">
                    <p>
                      <span className="font-semibold">
                        Invoice No:
                      </span>{" "}
                      {invoice.invoiceNumber}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Order No:
                      </span>{" "}
                      {invoice.order.orderNumber}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Date:
                      </span>{" "}
                      {formatDate(invoice.order.createdAt)}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      {invoice.order.status}
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="qr-container flex items-center gap-3 md:flex-row-reverse">
                  <div className="rounded-md border border-black bg-white p-2">
                    <QRCodeSVG
                      value={verificationUrl}
                      size={78}
                      level="M"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs font-semibold text-black">
                      Scan to verify invoice
                    </p>

                    <p className="mt-1 max-w-[160px] text-xs text-black">
                      Scan this QR code to verify this invoice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer and Payment */}
            <div className="invoice-info-section grid gap-6 py-6 md:grid-cols-2">
              {/* Bill To */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-black">
                  Bill To
                </h3>

                <div className="space-y-1 text-sm text-black">
                  <p className="font-semibold">
                    {invoice.order.customerName}
                  </p>

                  <p>{invoice.order.phone}</p>

                  <p>{invoice.order.address}</p>
                </div>
              </div>

              {/* Payment */}
              <div className="md:text-right">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-black">
                  Payment Information
                </h3>

                {invoice.payment ? (
                  <div className="space-y-1 text-sm text-black">
                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      {invoice.payment.status}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Method:
                      </span>{" "}
                      {invoice.payment.method || "N/A"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Transaction ID:
                      </span>{" "}
                      {invoice.payment.transactionId || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-black">
                    Payment information not available
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-black">
                <thead>
                  <tr className="border-y border-black">
                    <th className="py-3 pr-2 font-bold text-black">
                      #
                    </th>

                    <th className="px-2 py-3 font-bold text-black">
                      Product
                    </th>

                    <th className="px-2 py-3 text-center font-bold text-black">
                      Quantity
                    </th>

                    <th className="px-2 py-3 text-right font-bold text-black">
                      Price
                    </th>

                    <th className="py-3 pl-2 text-right font-bold text-black">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr
                      key={item.productId}
                      className="invoice-item-row border-b border-gray-300"
                    >
                      <td className="py-3 pr-2 text-black">
                        {index + 1}
                      </td>

                      <td className="px-2 py-3 font-medium text-black">
                        {item.productName}
                      </td>

                      <td className="px-2 py-3 text-center text-black">
                        {item.quantity}
                      </td>

                      <td className="px-2 py-3 text-right text-black">
                        {formatCurrency(item.price)}
                      </td>

                      <td className="py-3 pl-2 text-right font-semibold text-black">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="invoice-totals ml-auto mt-6 max-w-sm text-sm text-black">
              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="text-black">
                  Subtotal
                </span>

                <span className="font-medium text-black">
                  {formatCurrency(invoice.order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="text-black">
                  Discount
                </span>

                <span className="font-medium text-black">
                  {formatCurrency(invoice.order.discount)}
                </span>
              </div>

              <div className="flex justify-between border-b-2 border-black py-3 text-base">
                <span className="font-bold text-black">
                  Total
                </span>

                <span className="font-bold text-black">
                  {formatCurrency(invoice.order.total)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="invoice-footer mt-8 flex flex-col items-center justify-between gap-4 border-t border-black pt-5 text-center text-sm text-black md:flex-row md:text-left">
              <div>
                <p className="font-medium">
                  Thank you for choosing{" "}
                  {invoice.store.storeName}!
                </p>

                <p className="mt-1 text-black">
                  This is a computer-generated invoice.
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="font-semibold text-black">
                  Invoice ID
                </p>

                <p className="mt-1 break-all text-xs text-black">
                  {invoice.order.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}