import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0EEE9]">
      {/* Header */}
      <header className="border-b border-[#E4DDD2] bg-[#FAFAF8]">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#5C5850] hover:text-[#1A1A1A] transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            <span>Back to home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#7A9A7E] transition-colors duration-150 group-hover:bg-[#5E7D63]">
              <Shield size={14} color="#FFFFFF" strokeWidth={2} />
            </div>
            <span className="text-base font-bold text-[#1A1A1A] tracking-tight">Hesabaty</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4DDD2] bg-[#FAFAF8] py-6 px-4">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#9C9485]">
            &copy; {new Date().getFullYear()} Hesabaty. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-[#9C9485] hover:text-[#5C5850] transition-colors duration-150 cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[#9C9485] hover:text-[#5C5850] transition-colors duration-150 cursor-pointer">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
