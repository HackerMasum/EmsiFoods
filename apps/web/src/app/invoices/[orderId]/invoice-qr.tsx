"use client";

import { QRCodeSVG } from "qrcode.react";

type InvoiceQrProps = {
  invoiceNumber: string;
  orderId: string;
};

export function InvoiceQr({
  invoiceNumber,
  orderId,
}: InvoiceQrProps) {
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invoices/${orderId}`
      : `/invoices/${orderId}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-lg border border-black bg-white p-3">
        <QRCodeSVG
          value={verificationUrl}
          size={110}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold text-black">
          Scan to view invoice
        </p>

        <p className="mt-1 text-xs text-black">
          {invoiceNumber}
        </p>
      </div>
    </div>
  );
}