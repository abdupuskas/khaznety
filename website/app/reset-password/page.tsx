"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Status = "loading" | "ready" | "invalid" | "submitting" | "done";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorDescription =
        url.searchParams.get("error_description") ||
        new URLSearchParams(window.location.hash.replace(/^#/, "")).get(
          "error_description"
        );

      if (errorDescription) {
        if (!cancelled) {
          setError(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
          setStatus("invalid");
        }
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (exchangeError) {
          setError(exchangeError.message);
          setStatus("invalid");
          return;
        }
        setStatus("ready");
        return;
      }

      // Legacy hash-based recovery links — detectSessionInUrl handles them.
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setStatus("ready");
      } else {
        setStatus("invalid");
        setError("This password reset link is invalid or has expired. Please request a new one from the app.");
      }
    };

    initSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setStatus("submitting");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setStatus("ready");
      return;
    }

    await supabase.auth.signOut();
    setStatus("done");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FF] flex flex-col">
      <header className="border-b border-[#E2E8F0] bg-[#FFFFFF]">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#0F172A] transition-colors duration-150"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            <span>Back to home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="" aria-hidden="true" className="w-7 h-7 rounded-lg" />
            <span className="text-base font-bold text-[#0F172A] tracking-tight">Hesabaty</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
            {status === "loading" && (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-sm text-[#475569]">Verifying reset link…</p>
              </div>
            )}

            {status === "invalid" && (
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Link expired</h1>
                <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                  {error ||
                    "This password reset link is invalid or has already been used."}
                </p>
                <p className="mt-4 text-sm text-[#475569]">
                  Open the Hesabaty app and tap <strong>Forgot password?</strong> again to receive a new link.
                </p>
              </div>
            )}

            {(status === "ready" || status === "submitting") && (
              <>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Set a new password</h1>
                <p className="mt-2 text-sm text-[#475569]">
                  Choose a new password for your Hesabaty account.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide text-[#475569] uppercase mb-2">
                      New password
                    </label>
                    <div className="flex items-center gap-2 bg-[#F7F9FF] border border-[#E2E8F0] rounded-xl px-4 py-3">
                      <Lock size={16} strokeWidth={1.75} className="text-[#94A3B8]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="flex-1 bg-transparent text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-[#94A3B8] hover:text-[#475569] transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide text-[#475569] uppercase mb-2">
                      Confirm password
                    </label>
                    <div className="flex items-center gap-2 bg-[#F7F9FF] border border-[#E2E8F0] rounded-xl px-4 py-3">
                      <Lock size={16} strokeWidth={1.75} className="text-[#94A3B8]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        className="flex-1 bg-transparent text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting" || !password || !confirm}
                    className="w-full bg-[#0F172A] text-white font-semibold py-4 rounded-xl hover:bg-[#1E293B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? "Updating…" : "Update password"}
                  </button>
                </form>
              </>
            )}

            {status === "done" && (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check size={32} strokeWidth={2.4} className="text-emerald-700" />
                </div>
                <h1 className="mt-5 text-2xl font-bold text-[#0F172A] tracking-tight">Password updated</h1>
                <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                  You can now open the Hesabaty app and sign in with your new password.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-6 px-4">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#94A3B8]">
            &copy; {new Date().getFullYear()} Hesabaty. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-[#94A3B8] hover:text-[#475569] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-[#94A3B8] hover:text-[#475569] transition-colors">
              Terms
            </Link>
            <Link href="/support" className="text-xs text-[#94A3B8] hover:text-[#475569] transition-colors">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
