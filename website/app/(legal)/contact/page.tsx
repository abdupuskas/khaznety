"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

// To activate form submissions:
// 1. Go to https://formspree.io → create a free account → new form
// 2. Replace the FORMSPREE_ID below with your form ID (e.g. "xpwzgkrq")
const FORMSPREE_ID = "YOUR_FORMSPREE_ID";
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Fallback to mailto if Formspree isn't configured yet
    if (FORMSPREE_ID === "YOUR_FORMSPREE_ID") {
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const subject = data.get("subject") as string;
      const message = data.get("message") as string;
      const mailto = `mailto:hello@hesabaty.com?subject=${encodeURIComponent(subject || "Contact from website")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailto;
      setState("idle");
      return;
    }

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setState("success");
        form.reset();
      } else {
        const body = await res.json();
        setErrorMsg(body?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF] mb-6">
          <CheckCircle size={32} color="#111827" strokeWidth={1.75} />
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Message sent!</h2>
        <p className="mt-3 text-[#475569] max-w-sm">
          Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-8 rounded-full border border-[#E2E8F0] px-5 py-2 text-sm font-medium text-[#475569] hover:bg-[#EEF2FF] transition-colors duration-150 cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-8 mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-3">Support</p>
        <h1 className="text-3xl font-bold text-[#0F172A]">Contact Us</h1>
        <p className="mt-3 text-[#475569]">
          Have a question, feedback, or need help? We&apos;d love to hear from you.
          We typically respond within 1–2 business days.
        </p>
      </div>

      {/* Quick contact options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          {
            label: "General enquiries",
            value: "hello@hesabaty.com",
            href: "mailto:hello@hesabaty.com",
          },
          {
            label: "Privacy & data",
            value: "privacy@hesabaty.com",
            href: "mailto:privacy@hesabaty.com",
          },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="group block rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-4 hover:border-[#C7D2FE] hover:bg-[#EEF2FF] transition-colors duration-150 cursor-pointer"
          >
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1">{c.label}</p>
            <p className="text-sm font-medium text-[#111827]">{c.value}</p>
          </a>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
              Your name <span className="text-[#C0392B]">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Abdu Hassan"
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/20"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
              Email address <span className="text-[#C0392B]">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="abdu@example.com"
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
            Subject <span className="text-[#C0392B]">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-colors duration-150 focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/20 cursor-pointer appearance-none"
          >
            <option value="" disabled>Select a topic…</option>
            <option value="General question">General question</option>
            <option value="Bug report">Bug report</option>
            <option value="Feature request">Feature request</option>
            <option value="Subscription / billing">Subscription / billing</option>
            <option value="Privacy / data">Privacy / data</option>
            <option value="Press / partnership">Press / partnership</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
            Message <span className="text-[#C0392B]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Tell us what's on your mind…"
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/20 resize-none"
          />
        </div>

        {state === "error" && (
          <p className="rounded-xl bg-[#FEE2E2] border border-[#C0392B]/20 px-4 py-3 text-sm text-[#C0392B]">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0F172A] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
        >
          <Send size={15} strokeWidth={1.75} />
          {state === "submitting" ? "Sending…" : "Send message"}
        </button>

        <p className="text-xs text-[#94A3B8]">
          By submitting this form you agree to our{" "}
          <a href="https://hesabatypersonal.vercel.app/privacy" className="text-[#111827] hover:underline cursor-pointer">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}
