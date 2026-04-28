import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F9FF]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-[#FFFFFF]">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#0F172A] transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            <span>Back to home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <img src="/icon.png" alt="" aria-hidden="true" className="w-7 h-7 rounded-lg" />
            <span className="text-base font-bold text-[#0F172A] tracking-tight">Hesabaty</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-6 px-4">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#94A3B8]">
            &copy; {new Date().getFullYear()} Hesabaty. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="https://hesabatypersonal.vercel.app/privacy" className="text-xs text-[#94A3B8] hover:text-[#475569] transition-colors duration-150 cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[#94A3B8] hover:text-[#475569] transition-colors duration-150 cursor-pointer">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
