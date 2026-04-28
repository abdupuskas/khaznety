"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";

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
            ? "rgba(250, 250, 248, 0.92)"
            : "rgba(250, 250, 248, 0)",
          borderColor: scrolled
            ? "rgba(228, 221, 210, 1)"
            : "rgba(228, 221, 210, 0)",
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
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7A9A7E] transition-colors duration-200 group-hover:bg-[#5E7D63]">
              <Shield size={16} color="#FFFFFF" strokeWidth={2} />
            </div>
            <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">
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
                  className="cursor-pointer px-3 py-2 text-sm font-medium text-[#5C5850] rounded-lg transition-colors duration-200 hover:text-[#1A1A1A] hover:bg-[#EEECE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A9A7E]"
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
              className="hidden sm:inline-flex cursor-pointer items-center px-5 py-2 text-sm font-semibold text-white bg-[#7A9A7E] rounded-full transition-colors duration-200 hover:bg-[#5E7D63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A9A7E]"
            >
              Download
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 hover:bg-[#EEECE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A9A7E]"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={20} color="#1A1A1A" strokeWidth={1.75} />
              ) : (
                <Menu size={20} color="#1A1A1A" strokeWidth={1.75} />
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
              className="md:hidden overflow-hidden border-t border-[#E4DDD2]"
            >
              <ul className="flex flex-col gap-1 py-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="cursor-pointer block px-3 py-2.5 text-sm font-medium text-[#5C5850] rounded-lg transition-colors duration-200 hover:text-[#1A1A1A] hover:bg-[#EEECE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A9A7E]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="#download"
                    onClick={(e) => handleSmoothScroll(e, "#download")}
                    className="cursor-pointer flex items-center justify-center mx-3 px-5 py-2.5 text-sm font-semibold text-white bg-[#7A9A7E] rounded-full transition-colors duration-200 hover:bg-[#5E7D63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A9A7E]"
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
