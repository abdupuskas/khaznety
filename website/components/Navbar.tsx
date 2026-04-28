"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

const SCROLL_THRESHOLD = 50;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);

    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.header
      className="fixed top-4 left-4 right-4 z-50"
      initial={false}
    >
      <motion.nav
        className="mx-auto max-w-6xl rounded-2xl px-4 sm:px-6 transition-shadow duration-200"
        animate={{
          backgroundColor: scrolled
            ? "rgba(247, 249, 255, 0.92)"
            : "rgba(247, 249, 255, 0)",
          borderColor: scrolled
            ? "rgba(226, 232, 240, 1)"
            : "rgba(226, 232, 240, 0)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.25, ease: "easeOut" }
        }
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
      >
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
              });
            }}
            className="flex items-center gap-2 cursor-pointer group"
            aria-label="Hesabaty - back to top"
          >
            <img src="/icon.png" alt="" aria-hidden="true" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold text-[#0F172A] tracking-tight">
              Hesabaty
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="cursor-pointer px-3 py-2 text-sm font-medium text-[#475569] rounded-lg transition-colors duration-200 hover:text-[#0F172A] hover:bg-[#EEF2FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Download CTA */}
            <a
              href="#download"
              onClick={(e) => handleSmoothScroll(e, "#download")}
              className="hidden sm:inline-flex cursor-pointer items-center px-5 py-2 text-sm font-semibold text-white bg-[#111827] rounded-full transition-colors duration-200 hover:bg-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
            >
              Download
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 hover:bg-[#EEF2FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={20} color="#0F172A" strokeWidth={1.75} />
              ) : (
                <Menu size={20} color="#0F172A" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: "easeOut" }
              }
              className="md:hidden overflow-hidden border-t border-[#E2E8F0]"
            >
              <ul className="flex flex-col gap-1 py-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="cursor-pointer block px-3 py-2.5 text-sm font-medium text-[#475569] rounded-lg transition-colors duration-200 hover:text-[#0F172A] hover:bg-[#EEF2FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="#download"
                    onClick={(e) => handleSmoothScroll(e, "#download")}
                    className="cursor-pointer flex items-center justify-center mx-3 px-5 py-2.5 text-sm font-semibold text-white bg-[#111827] rounded-full transition-colors duration-200 hover:bg-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
                  >
                    Download
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
