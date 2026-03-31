import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Khaznety - Your money, finally clear.",
  description:
    "Automated expense tracking for Egypt. Apple Pay, bank SMS, budgets that roll over.",
  openGraph: {
    title: "Khaznety - Your money, finally clear.",
    description:
      "Automated expense tracking for Egypt. Apple Pay, bank SMS, budgets that roll over.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
