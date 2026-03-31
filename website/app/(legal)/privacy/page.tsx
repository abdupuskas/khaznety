import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Khaznety",
  description: "How Khaznety collects, uses, and protects your personal and financial data.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-[#1A7A52] mb-3">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#5C5850]">
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A7A52]" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <article>
      {/* Header */}
      <div className="border-b border-[#E4DDD2] pb-8 mb-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9C9485] mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Privacy Policy</h1>
        <p className="mt-3 text-[#5C5850]">
          Khaznety is committed to protecting your privacy. This policy explains what data we
          collect, why we collect it, and how we keep it safe.
        </p>
        <p className="mt-3 text-sm text-[#9C9485]">
          Last updated: March 2026 &nbsp;·&nbsp; Effective date: March 2026
        </p>
      </div>

      <Section title="1. Who We Are">
        <p>
          Khaznety ("we", "our", "us") is a personal budgeting application designed for users in
          Egypt. We are the data controller for all personal data processed through the Khaznety
          mobile app and this website.
        </p>
        <p>
          Questions about this policy? Contact us at{" "}
          <a href="mailto:privacy@khaznety.com" className="text-[#1A7A52] hover:underline cursor-pointer">
            privacy@khaznety.com
          </a>
          .
        </p>
      </Section>

      <Section title="2. Data We Collect">
        <p>We collect only what is necessary to provide the service:</p>

        <div className="mt-3">
          <p className="font-semibold text-[#1A1A1A] mb-2">Account data</p>
          <ul className="space-y-1.5">
            <Bullet>Email address (used for authentication and account recovery)</Bullet>
            <Bullet>Display name (optional, used in the app interface)</Bullet>
            <Bullet>Password (stored as a bcrypt hash — we never see your plain-text password)</Bullet>
          </ul>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-[#1A1A1A] mb-2">Financial data you enter</p>
          <ul className="space-y-1.5">
            <Bullet>Transaction amounts, dates, merchants, and categories you add manually or via automation</Bullet>
            <Bullet>Budget limits and allocation templates you configure</Bullet>
            <Bullet>Subscription and bill records you create</Bullet>
            <Bullet>Goal names and target amounts</Bullet>
            <Bullet>Account balances you record</Bullet>
          </ul>
          <p className="mt-2 text-sm italic text-[#9C9485]">
            All monetary amounts are stored as integers (piastres) to avoid floating-point errors.
            We never store raw bank account numbers or card numbers.
          </p>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-[#1A1A1A] mb-2">Automated tracking data</p>
          <ul className="space-y-1.5">
            <Bullet>
              <strong>Apple Pay (iOS):</strong> When you use the Apple Shortcuts integration,
              the Shortcut sends us the merchant name, amount, currency, and timestamp. Raw
              Apple Pay receipt data is never transmitted to or stored by Khaznety.
            </Bullet>
            <Bullet>
              <strong>Bank SMS (iOS &amp; Android):</strong> On iOS, an Apple Shortcut parses
              incoming bank SMS notifications and forwards extracted fields (amount, type,
              merchant, account last 4 digits) to the app. On Android, we request SMS read
              permission to parse messages from banks you configure. The raw SMS message text
              is <strong>never stored</strong> — only the parsed transaction fields are saved.
            </Bullet>
          </ul>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-[#1A1A1A] mb-2">Voice input (optional)</p>
          <ul className="space-y-1.5">
            <Bullet>
              When you use voice input to add a transaction, your speech is processed locally
              on-device using the system speech recognition framework. Only the parsed result
              (amount and merchant name) is saved — the audio is never transmitted to our servers.
            </Bullet>
          </ul>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-[#1A1A1A] mb-2">Usage and device data</p>
          <ul className="space-y-1.5">
            <Bullet>App crash reports and diagnostic logs (anonymised)</Bullet>
            <Bullet>Device locale and language preference (to serve the correct language)</Bullet>
            <Bullet>Push notification token (for reminders and budget alerts)</Bullet>
          </ul>
        </div>
      </Section>

      <Section title="3. How We Use Your Data">
        <ul className="space-y-1.5">
          <Bullet>To provide, maintain, and improve the Khaznety service</Bullet>
          <Bullet>To authenticate you and keep your account secure</Bullet>
          <Bullet>To calculate budgets, rollovers, and analytics on your behalf</Bullet>
          <Bullet>To send push notifications you have opted in to (reminders, alerts)</Bullet>
          <Bullet>To process in-app subscription purchases via RevenueCat</Bullet>
          <Bullet>To respond to your support requests</Bullet>
        </ul>
        <p className="mt-3">
          We do <strong>not</strong> sell your data. We do not use your financial data for
          advertising. We do not share your personal data with third parties except as described
          in Section 4.
        </p>
      </Section>

      <Section title="4. Third-Party Services">
        <p>We use a small number of trusted third-party services to operate Khaznety:</p>

        <div className="mt-3 rounded-xl border border-[#E4DDD2] overflow-hidden">
          {[
            {
              name: "Supabase",
              purpose: "Database, authentication, and file storage",
              location: "EU (Frankfurt)",
              link: "https://supabase.com/privacy",
            },
            {
              name: "RevenueCat",
              purpose: "In-app subscription management and purchase validation",
              location: "USA",
              link: "https://www.revenuecat.com/privacy",
            },
            {
              name: "Expo / EAS",
              purpose: "App build infrastructure and push notification delivery",
              location: "USA",
              link: "https://expo.dev/privacy",
            },
            {
              name: "Apple (iOS only)",
              purpose: "App Store distribution, Apple Pay processing",
              location: "USA",
              link: "https://www.apple.com/legal/privacy/",
            },
            {
              name: "Google (Android only)",
              purpose: "Google Play distribution, billing",
              location: "USA",
              link: "https://policies.google.com/privacy",
            },
          ].map((s, i) => (
            <div
              key={s.name}
              className={`px-4 py-3 ${i > 0 ? "border-t border-[#E4DDD2]" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-1">
                <p className="font-semibold text-[#1A1A1A] text-sm">{s.name}</p>
                <span className="text-xs text-[#9C9485] bg-[#EEECE7] px-2 py-0.5 rounded-full">
                  {s.location}
                </span>
              </div>
              <p className="text-sm text-[#5C5850] mt-0.5">{s.purpose}</p>
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1A7A52] hover:underline cursor-pointer mt-0.5 inline-block"
              >
                Privacy policy →
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="5. Data Storage and Security">
        <ul className="space-y-1.5">
          <Bullet>
            Your data is stored in Supabase (PostgreSQL) hosted in the EU (Frankfurt region).
            Data is encrypted at rest using AES-256 and in transit using TLS 1.3.
          </Bullet>
          <Bullet>
            Authentication tokens are stored in your device's secure storage — iOS Keychain
            or Android EncryptedSharedPreferences. They are never stored in plain text.
          </Bullet>
          <Bullet>
            Row-Level Security (RLS) is enforced on every database table — your data is
            isolated from other users at the database level.
          </Bullet>
          <Bullet>
            We never store raw SMS content, raw bank messages, or audio recordings.
          </Bullet>
        </ul>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your data for as long as your account is active. If you delete your account:
        </p>
        <ul className="space-y-1.5 mt-2">
          <Bullet>Your personal data and all financial records are permanently deleted within 30 days.</Bullet>
          <Bullet>Aggregated, anonymised usage statistics (with no personal identifiers) may be retained for service improvement.</Bullet>
          <Bullet>Legal retention obligations may require us to keep billing records for up to 7 years.</Bullet>
        </ul>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to:</p>
        <ul className="space-y-1.5 mt-2">
          <Bullet><strong>Access</strong> — request a copy of all data we hold about you</Bullet>
          <Bullet><strong>Correction</strong> — update inaccurate or incomplete data directly in the app or by contacting us</Bullet>
          <Bullet><strong>Deletion</strong> — delete your account and all associated data via Settings → Account → Delete Account</Bullet>
          <Bullet><strong>Export</strong> — export your transaction data as CSV or PDF at any time via Settings → Export</Bullet>
          <Bullet><strong>Portability</strong> — receive your data in a machine-readable format upon request</Bullet>
          <Bullet><strong>Objection</strong> — object to how we process your data</Bullet>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, email us at{" "}
          <a href="mailto:privacy@khaznety.com" className="text-[#1A7A52] hover:underline cursor-pointer">
            privacy@khaznety.com
          </a>
          . We will respond within 30 days.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          Khaznety is not intended for users under the age of 13. We do not knowingly collect
          personal data from children. If you believe a child has provided us with personal data,
          please contact us immediately and we will delete it.
        </p>
      </Section>

      <Section title="9. Push Notifications">
        <p>
          We send push notifications only for purposes you have consented to — budget alerts,
          subscription renewal reminders, and goal milestone updates. You can manage your
          notification preferences in Settings → Notifications, or via your device's
          notification settings.
        </p>
      </Section>

      <Section title="10. Language">
        <p>
          This Privacy Policy is written in English. An Arabic translation is available in the
          app. In case of any conflict between the English and Arabic versions, the English version
          prevails.
        </p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant
          changes via a push notification or an in-app banner. The "Last updated" date at the top
          of this page will always reflect the most recent revision. Continued use of the app
          after changes are posted constitutes your acceptance of the updated policy.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Khaznety &mdash; Privacy Enquiries
          <br />
          <a href="mailto:privacy@khaznety.com" className="text-[#1A7A52] hover:underline cursor-pointer">
            privacy@khaznety.com
          </a>
        </p>
      </Section>
    </article>
  );
}
