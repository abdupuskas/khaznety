import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Hesabaty",
  description: "Terms and conditions for using Hesabaty, including subscription and refund policies.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-[#7A9A7E] mb-3">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#5C5850]">
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7A9A7E]" />
      <span>{children}</span>
    </li>
  );
}

export default function TermsPage() {
  return (
    <article>
      {/* Header */}
      <div className="border-b border-[#E4DDD2] pb-8 mb-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9C9485] mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Terms of Service</h1>
        <p className="mt-3 text-[#5C5850]">
          Please read these terms carefully before using Hesabaty. By downloading or using the
          app, you agree to be bound by these terms.
        </p>
        <p className="mt-3 text-sm text-[#9C9485]">
          Last updated: March 2026 &nbsp;·&nbsp; Effective date: March 2026
        </p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using the Hesabaty mobile application ("App") or website
          ("Site"), you agree to these Terms of Service ("Terms"). If you do not agree,
          do not use the App or Site.
        </p>
        <p>
          These Terms form a legally binding agreement between you and Hesabaty ("we",
          "us", "our"). We may update these Terms at any time. Continued use of the App
          after changes are posted constitutes acceptance.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <ul className="space-y-1.5">
          <Bullet>You must be at least 13 years old to use Hesabaty.</Bullet>
          <Bullet>You must provide accurate and complete registration information.</Bullet>
          <Bullet>You are responsible for maintaining the security of your account credentials.</Bullet>
          <Bullet>You are responsible for all activity that occurs under your account.</Bullet>
        </ul>
      </Section>

      <Section title="3. The Service">
        <p>
          Hesabaty is a personal budgeting tool that helps you track expenses, manage budgets,
          and monitor subscriptions. The App is provided for personal, non-commercial use only.
        </p>
        <p>
          Hesabaty is a financial <strong>tracking</strong> tool, not a financial advisor.
          Nothing in the App constitutes financial, investment, tax, or legal advice. You are
          solely responsible for your financial decisions.
        </p>
        <p>
          We do not connect directly to your bank account. Any transaction data in the App
          is either entered manually by you or parsed from notifications you have configured.
        </p>
      </Section>

      <Section title="4. Free Plan and Hesabaty Pro Subscription">
        <p>
          Hesabaty offers a free tier ("Free Plan") and a paid subscription tier
          ("Hesabaty Pro"). Features available under each plan are described in the App and on
          our website. We reserve the right to modify the features available in each plan with
          reasonable notice.
        </p>

        <div className="rounded-xl border border-[#E4DDD2] bg-[#FAFAF8] p-5 mt-3">
          <p className="font-semibold text-[#1A1A1A] mb-3">
            Subscription terms (required Apple disclosure)
          </p>
          <ul className="space-y-2">
            <Bullet>
              Hesabaty Pro is offered as a <strong>monthly</strong> or <strong>annual</strong>{" "}
              auto-renewing subscription.
            </Bullet>
            <Bullet>
              Payment is charged to your App Store or Google Play account at confirmation of
              purchase.
            </Bullet>
            <Bullet>
              <strong>Auto-renewal:</strong> Your subscription automatically renews unless
              auto-renew is turned off at least 24 hours before the end of the current period.
            </Bullet>
            <Bullet>
              Your account will be charged for renewal within 24 hours prior to the end of the
              current subscription period.
            </Bullet>
            <Bullet>
              Subscriptions may be managed and auto-renewal turned off in your App Store /
              Google Play account settings after purchase.
            </Bullet>
            <Bullet>
              A 7-day free trial is available for new subscribers. Any unused portion of the
              free trial period is forfeited when a subscription is purchased.
            </Bullet>
            <Bullet>
              Current pricing: Monthly ~49–79 EGP/month · Annual ~399–599 EGP/year (exact
              price displayed at checkout and may vary by region).
            </Bullet>
          </ul>
        </div>
      </Section>

      <Section title="5. Cancellation and Refunds">
        <p>
          You may cancel your Hesabaty Pro subscription at any time through your App Store
          (iOS) or Google Play (Android) account settings. Cancellation takes effect at the
          end of the current billing period — you retain access to Pro features until then.
        </p>
        <p>
          <strong>Refunds:</strong> All purchases are processed by Apple or Google. Refund
          requests must be submitted directly to them:
        </p>
        <ul className="space-y-1.5 mt-2">
          <Bullet>
            <strong>iOS / App Store:</strong>{" "}
            <a
              href="https://support.apple.com/en-us/118223"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7A9A7E] hover:underline cursor-pointer"
            >
              reportaproblem.apple.com
            </a>
          </Bullet>
          <Bullet>
            <strong>Android / Google Play:</strong>{" "}
            <a
              href="https://support.google.com/googleplay/answer/2479637"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7A9A7E] hover:underline cursor-pointer"
            >
              Google Play refund policy
            </a>
          </Bullet>
        </ul>
        <p className="mt-2">
          We are unable to process refunds directly. We will assist Apple or Google in any
          refund investigation if contacted.
        </p>
      </Section>

      <Section title="6. User Responsibilities">
        <p>You agree not to:</p>
        <ul className="space-y-1.5 mt-2">
          <Bullet>Use the App for any unlawful purpose or in violation of applicable laws</Bullet>
          <Bullet>Attempt to reverse-engineer, decompile, or extract the source code of the App</Bullet>
          <Bullet>Use automated tools to scrape, crawl, or extract data from the App</Bullet>
          <Bullet>Impersonate any person or entity or falsely represent your affiliation</Bullet>
          <Bullet>Attempt to gain unauthorised access to any part of the App or its infrastructure</Bullet>
          <Bullet>Transmit malware, viruses, or any harmful code</Bullet>
          <Bullet>Share your account credentials with others</Bullet>
        </ul>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          All content in the App — including but not limited to the design, code, graphics,
          logos, and text — is owned by or licensed to Hesabaty and protected by applicable
          intellectual property laws.
        </p>
        <p>
          You retain ownership of all data you enter into the App. You grant us a limited,
          non-exclusive licence to store and process that data solely to provide the service
          to you.
        </p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <p>
          THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
          EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that: (a) the App will be uninterrupted or error-free; (b)
          any data, including financial data parsed from bank SMS or Apple Pay, will be
          complete or accurate; (c) defects will be corrected.
        </p>
        <p>
          Financial data displayed in the App may not match your actual bank balance. Always
          verify critical financial information with your bank directly.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HESABATY SHALL NOT BE LIABLE
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
          FROM YOUR USE OF OR INABILITY TO USE THE APP, INCLUDING BUT NOT LIMITED TO LOSS
          OF DATA, FINANCIAL LOSS, OR LOSS OF PROFITS, EVEN IF WE HAVE BEEN ADVISED OF THE
          POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p>
          OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING OUT OF THESE TERMS OR YOUR USE
          OF THE APP SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS
          PRECEDING THE CLAIM.
        </p>
      </Section>

      <Section title="10. Termination">
        <p>
          We reserve the right to suspend or terminate your account if you breach these Terms,
          without prior notice. Upon termination, your right to use the App ceases immediately.
          You may delete your account at any time in Settings → Account → Delete Account.
        </p>
      </Section>

      <Section title="11. Governing Law">
        <p>
          These Terms are governed by the laws of the Arab Republic of Egypt. Any dispute
          arising from these Terms shall be subject to the exclusive jurisdiction of the courts
          of Cairo, Egypt.
        </p>
      </Section>

      <Section title="12. Changes to These Terms">
        <p>
          We may revise these Terms at any time. We will provide reasonable notice of material
          changes via the App or email. The "Last updated" date at the top of this page reflects
          the latest revision.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Questions about these Terms?
          <br />
          <a
            href="mailto:legal@hesabaty.com"
            className="text-[#7A9A7E] hover:underline cursor-pointer"
          >
            legal@hesabaty.com
          </a>
        </p>
      </Section>
    </article>
  );
}
