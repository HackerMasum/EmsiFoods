import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmsiFoods",
  description: "EmsiFoods - Fresh food delivered to your door",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}