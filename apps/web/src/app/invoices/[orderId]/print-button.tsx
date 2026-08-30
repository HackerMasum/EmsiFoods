"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
    >
      Print Invoice
    </button>
  );
}