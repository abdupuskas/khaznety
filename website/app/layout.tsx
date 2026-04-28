import type { Metadata } from "next";
import "./globals.css";

// Typography uses the system-ui font stack defined in globals.css. Removing the
// `next/font/google` import eliminates the build-time fetch from Google's CDN
// that previously broke CI when network access was unavailable. To restore
// Inter, drop a `public/fonts/inter.woff2` file and switch to `next/font/local`.

export const metadata: Metadata = {
  title: "Hesabaty - Your money, finally clear.",
  description:
    "Automated expense tracking for Egypt. Apple Pay, bank SMS, budgets that roll over.",
  openGraph: {
    title: "Hesabaty - Your money, finally clear.",
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
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
