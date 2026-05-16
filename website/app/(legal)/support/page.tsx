import Link from "next/link";
import { Mail, MessageCircle, Shield, Smartphone, CreditCard, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Support — Hesabaty",
  description:
    "Get help with Hesabaty: SMS automation setup, Apple Pay tracking, subscriptions, and account questions.",
};

const FAQS = [
  {
    q: "How do I set up automatic SMS tracking?",
    a: "Hesabaty uses the iOS Shortcuts app to forward your bank notifications. After signing in, open the in-app guide under Settings → Auto-tracking. We support 12 Egyptian banks, including NBE, CIB, QNB, Banque Misr, and AAIB.",
  },
  {
    q: "Why didn't my transaction show up?",
    a: "Make sure the Shortcut is enabled and that your bank's SMS format hasn't recently changed. If you tap on the SMS in the Messages app and run the Shortcut manually, the transaction should appear within a few seconds. Still stuck? Email us with the bank name and we'll add support.",
  },
  {
    q: "How do I cancel my Hesabaty Pro subscription?",
    a: "Subscriptions are managed through your Apple ID. Open Settings → [Your Name] → Subscriptions → Hesabaty Pro → Cancel Subscription. You'll keep Pro features until the end of the current billing period.",
  },
  {
    q: "Can I get a refund?",
    a: "Refunds are handled by Apple. You can request one directly at reportaproblem.apple.com using the Apple ID you used to subscribe. If something went wrong on our end, contact us and we'll help.",
  },
  {
    q: "Is my financial data private?",
    a: "Yes. We never store the raw SMS body — only the parsed amount, merchant, and category. All data is encrypted in transit and at rest, and we never sell or share your data with third parties.",
  },
  {
    q: "I forgot my password / can't sign in.",
    a: "Tap 'Forgot password' on the sign-in screen and enter your email. You'll receive a reset link within a minute. If it doesn't arrive, check your spam folder or email us.",
  },
  {
    q: "Does Hesabaty work outside Egypt?",
    a: "Hesabaty is built specifically for Egyptian banks and EGP currency. Other currencies and international banks aren't supported yet.",
  },
  {
    q: "How do I export my data?",
    a: "Hesabaty Pro lets you export all your transactions as CSV or PDF. Go to Settings → Export Data and choose your format and date range.",
  },
];

const CHANNELS = [
  {
    icon: Mail,
    label: "Email support",
    value: "hello@hesabaty.com",
    href: "mailto:hello@hesabaty.com",
    note: "We reply within 1–2 business days.",
  },
  {
    icon: Shield,
    label: "Privacy & data requests",
    value: "privacy@hesabaty.com",
    href: "mailto:privacy@hesabaty.com",
    note: "Data deletion, exports, or privacy questions.",
  },
];

const TOPICS = [
  { icon: Smartphone, label: "SMS automation setup", href: "mailto:hello@hesabaty.com?subject=SMS%20automation%20setup" },
  { icon: CreditCard, label: "Subscription / billing", href: "mailto:hello@hesabaty.com?subject=Subscription%20%2F%20billing" },
  { icon: HelpCircle, label: "General question", href: "mailto:hello@hesabaty.com?subject=General%20question" },
  { icon: MessageCircle, label: "Feature request", href: "mailto:hello@hesabaty.com?subject=Feature%20request" },
];

export default function SupportPage() {
  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-8 mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-3">Support</p>
        <h1 className="text-3xl font-bold text-[#0F172A]">How can we help?</h1>
        <p className="mt-3 text-[#475569]">
          Browse common questions below, or reach out directly — we&apos;re a small team and
          we read every message.
        </p>
      </div>

      {/* Quick topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {TOPICS.map((t) => (
          <a
            key={t.label}
            href={t.href}
            className="group flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 hover:border-[#C7D2FE] hover:bg-[#EEF2FF] transition-colors duration-150 cursor-pointer"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#111827]">
              <t.icon size={16} strokeWidth={1.75} />
            </span>
            <span className="text-sm font-medium text-[#0F172A]">{t.label}</span>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">Frequently asked questions</h2>
        <div className="divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF]">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-[#0F172A] list-none">
                <span>{faq.q}</span>
                <span className="text-[#94A3B8] text-lg leading-none transition-transform duration-150 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact channels */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">Still need help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group block rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-4 hover:border-[#C7D2FE] hover:bg-[#EEF2FF] transition-colors duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <c.icon size={14} className="text-[#475569]" strokeWidth={1.75} />
                <p className="text-xs uppercase tracking-widest text-[#94A3B8]">{c.label}</p>
              </div>
              <p className="text-sm font-medium text-[#111827]">{c.value}</p>
              <p className="text-xs text-[#94A3B8] mt-1">{c.note}</p>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] px-4 py-4">
          <p className="text-sm text-[#475569]">
            Prefer a form?{" "}
            <Link href="/contact" className="font-medium text-[#111827] underline underline-offset-2 hover:text-[#0F172A]">
              Use our contact form →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
