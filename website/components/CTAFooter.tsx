"use client";

import { Smartphone, Play, Heart } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export function CTAFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* CTA Section */}
      <section id="download" className="bg-[#0F172A] py-20 px-4">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to take control?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Join thousands of Egyptians who finally understand where their money
            goes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              aria-label="Download on the App Store"
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-6 py-3 font-medium text-[#0F172A] transition-all duration-200 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Smartphone size={20} strokeWidth={1.75} />
              <span>App Store</span>
            </a>
            <a
              href="#"
              aria-label="Get it on Google Play"
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Play size={20} strokeWidth={1.75} />
              <span>Google Play</span>
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0F172A] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Top row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/icon.png" alt="" aria-hidden="true" className="w-6 h-6 rounded-lg" />
              <span className="text-lg font-bold text-white">Hesabaty</span>
            </div>
            <nav className="flex items-center gap-6">
              <a
                href="/privacy"
                className="cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Terms
              </a>
              <a
                href="/contact"
                className="cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Bottom row */}
          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="flex items-center justify-center gap-1 text-sm text-white/40">
              Made with{" "}
              <Heart
                size={14}
                className="text-[#C0392B]"
                fill="#C0392B"
                strokeWidth={0}
              />{" "}
              in Egypt
            </p>
            <p className="mt-2 text-xs text-white/30">
              &copy; {currentYear} Hesabaty. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
