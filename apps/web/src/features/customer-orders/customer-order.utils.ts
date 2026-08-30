import type {
  CustomerOrderStatus,
  PaymentStatus,
} from "./customer-order.types";

export function formatCurrency(
  value: number | string
): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatOrderDate(
  value: string
): string {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getOrderStatusLabel(
  status: CustomerOrderStatus
): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

export function getPaymentStatusLabel(
  status: PaymentStatus
): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}