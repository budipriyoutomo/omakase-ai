"use client";

import { useState } from "react";
import { Check, ChevronDown, Clock, TrendingUp, Zap } from "lucide-react";

const packages = [
  {
    name: "Starter",
    price: "Rp 49.000",
    credits: 50,
    perCredit: "Rp 980",
    quality: "Standard quality (Flux Schnell)",
    features: [
      "50 campaign generations",
      "Valid 12 months",
      "Email support",
    ],
    highlighted: false,
    badge: null,
    savings: null,
  },
  {
    name: "Growth",
    price: "Rp 149.000",
    credits: 200,
    perCredit: "Rp 745",
    quality: "HD quality (Flux 1.1 Pro)",
    features: [
      "200 campaign generations",
      "Valid 12 months",
      "Priority email support",
      "Access to all themes",
    ],
    highlighted: true,
    badge: "Most Popular",
    savings: "Save 24%",
  },
  {
    name: "Pro",
    price: "Rp 299.000",
    credits: 500,
    perCredit: "Rp 598",
    quality: "Ultra quality (Flux 1.1 Pro Ultra)",
    features: [
      "500 campaign generations",
      "Valid 12 months",
      "Priority support (WhatsApp)",
      "Access to all themes",
      "Early access to new features",
    ],
    highlighted: false,
    badge: null,
    savings: "Save 39%",
  },
];

const faqs = [
  {
    question: "Apakah credit bisa expired?",
    answer: "Credit berlaku 12 bulan sejak tanggal pembelian.",
  },
  {
    question: "Bisa beli lebih dari satu paket?",
    answer: "Ya, credit akan ditambahkan ke saldo yang ada.",
  },
  {
    question: "Metode pembayaran apa yang tersedia?",
    answer: "QRIS, Virtual Account (BCA, Mandiri, BNI), GoPay, OVO, dan Dana.",
  },
];

export default function SubscriptionPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleTopUp = (packageName: string) => {
    setSelectedPackage(packageName);
    // TODO: integrate with payment gateway
    console.log(`Selected package: ${packageName}`);
  };

  const currentCredits = 92;
  const totalPurchased = 200; // last purchased package size
  const usedPercentage = Math.round(((totalPurchased - currentCredits) / totalPurchased) * 100);

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-white">Subscription</h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Manage your credit balance and top up anytime.
        </p>
      </div>

      {/* ── Section 1: Current Balance ──────────────────────── */}
      <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wide">
                Current Balance
              </p>
              <p className="mt-2 text-5xl font-bold text-[#D4A017]">
                {currentCredits} Credits
              </p>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
              <Clock className="size-3.5" />
              Credits valid for 12 months from purchase date
            </p>

            {/* Usage bar */}
            <div className="max-w-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                <span>{usedPercentage}% used</span>
                <span>
                  {currentCredits} / {totalPurchased} credits remaining
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#2A2A2A]">
                <div
                  className="h-full rounded-full bg-[#D4A017] transition-all duration-500"
                  style={{ width: `${usedPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#D4A017] px-5 py-2.5 text-sm font-medium text-[#D4A017] transition hover:bg-[#D4A017] hover:text-black"
            onClick={() => {
              // TODO: navigate to transaction history
            }}
          >
            <TrendingUp className="size-4" />
            Transaction History
          </button>
        </div>
      </div>

      {/* ── Section 2: Credit Packages ──────────────────────── */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Credit Packages</h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Choose the package that fits your campaign needs.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.name;
            const isHighlighted = pkg.highlighted;

            return (
              <div
                key={pkg.name}
                className={`relative flex flex-col rounded-2xl border bg-[#141414] p-6 transition ${
                  isHighlighted
                    ? "border-[#D4A017] ring-1 ring-[#D4A017]/30"
                    : isSelected
                    ? "border-[#D4A017]"
                    : "border-[#2A2A2A]"
                }`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3 right-4 rounded-full bg-[#D4A017] px-3 py-0.5 text-xs font-semibold text-black">
                    {pkg.badge}
                  </div>
                )}

                {/* Package name */}
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">
                    {pkg.name}
                  </h3>
                  {pkg.savings && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      {pkg.savings}
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="mt-4 text-3xl font-bold text-white">
                  {pkg.price}
                </p>

                {/* Credits */}
                <p className="mt-1 text-lg font-medium text-[#D4A017]">
                  {pkg.credits} Credits
                </p>

                {/* Per credit cost */}
                <p className="mt-1 text-xs text-[#6B6B6B]">
                  ≈ {pkg.perCredit} / credit
                </p>

                {/* Quality hint */}
                <p className="mt-4 flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                  <Zap className="size-3 text-[#D4A017]" />
                  {pkg.quality}
                </p>

                {/* Feature list */}
                <ul className="mt-4 flex-1 space-y-2.5">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-[#6B6B6B]"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-[#D4A017]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => handleTopUp(pkg.name)}
                  className={`mt-6 w-full rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    isHighlighted
                      ? "bg-[#D4A017] text-black hover:bg-[#B8860B]"
                      : "border border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-black"
                  }`}
                >
                  Top Up {pkg.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 3: FAQ ──────────────────────────────────── */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Hal yang perlu diketahui sebelum top up.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqs.has(index);

            return (
              <div
                key={index}
                className="rounded-2xl border border-[#2A2A2A] bg-[#141414]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-[#D4A017] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-40 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="px-5 text-sm leading-relaxed text-[#6B6B6B]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}