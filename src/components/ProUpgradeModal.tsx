import React, { useState } from "react";
import {
  X,
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UserQuota, SubscriptionDetails } from "../types";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  quota?: UserQuota;
  subscription?: SubscriptionDetails;
  onUpgradeSuccess: (details: SubscriptionDetails) => void;
  onCancelSubscription?: () => void;
  reason?: "quota_exhausted" | "2k_resolution" | "brand_kit" | "manual";
}

type ModalStep = "plan_selection" | "checkout" | "processing" | "success" | "manage";

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  isPro,
  quota,
  subscription,
  onUpgradeSuccess,
  onCancelSubscription,
  reason = "manual",
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedPlanId, setSelectedPlanId] = useState<"pro" | "agency">("pro");
  const [currentStep, setCurrentStep] = useState<ModalStep>(
    isPro ? "manage" : "plan_selection"
  );

  // Checkout Form State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "google_pay" | "paypal">("card");
  const [cardName, setCardName] = useState("Mithra Varun Sasta");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvc, setCardCvc] = useState("789");
  const [billingCountry, setBillingCountry] = useState("US");
  const [billingZip, setBillingZip] = useState("94103");
  const [saveCard, setSaveCard] = useState(true);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  // Processing Animation Steps
  const [processingStage, setProcessingStage] = useState(1);

  // Completed Subscription Data for Receipt
  const [completedSub, setCompletedSub] = useState<SubscriptionDetails | null>(null);

  // Confirm cancel dialog state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  // Pricing calculations
  const baseMonthlyPro = 19;
  const baseAnnualPro = 15; // $180/yr
  const baseMonthlyAgency = 49;
  const baseAnnualAgency = 39; // $468/yr

  const currentMonthlyRate =
    selectedPlanId === "pro"
      ? billingCycle === "annual"
        ? baseAnnualPro
        : baseMonthlyPro
      : billingCycle === "annual"
      ? baseAnnualAgency
      : baseMonthlyAgency;

  const rawSubtotal = billingCycle === "annual" ? currentMonthlyRate * 12 : currentMonthlyRate;

  let discountAmount = 0;
  if (appliedPromo) {
    discountAmount = (rawSubtotal * appliedPromo.discountPercent) / 100;
  }

  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const cleaned = promoCodeInput.trim().toUpperCase();
    if (!cleaned) return;

    if (cleaned === "LAUNCH50" || cleaned === "HALFOFF") {
      setAppliedPromo({
        code: cleaned,
        discountPercent: 50,
        discountAmount: rawSubtotal * 0.5,
      });
      setPromoCodeInput("");
    } else if (cleaned === "CREATOR20" || cleaned === "SPECIAL20") {
      setAppliedPromo({
        code: cleaned,
        discountPercent: 20,
        discountAmount: rawSubtotal * 0.2,
      });
      setPromoCodeInput("");
    } else if (cleaned === "SAVE10") {
      setAppliedPromo({
        code: cleaned,
        discountPercent: 10,
        discountAmount: rawSubtotal * 0.1,
      });
      setPromoCodeInput("");
    } else {
      setPromoError("Invalid discount code. Try 'LAUNCH50' or 'CREATOR20'");
    }
  };

  const handleStartCheckout = (plan: "pro" | "agency") => {
    setSelectedPlanId(plan);
    setCurrentStep("checkout");
  };

  const handleProcessPayment = () => {
    setCurrentStep("processing");
    setProcessingStage(1);

    setTimeout(() => {
      setProcessingStage(2);
    }, 600);

    setTimeout(() => {
      setProcessingStage(3);
    }, 1200);

    setTimeout(() => {
      const now = new Date();
      const renewal = new Date();
      if (billingCycle === "annual") {
        renewal.setFullYear(renewal.getFullYear() + 1);
      } else {
        renewal.setMonth(renewal.getMonth() + 1);
      }

      const planName =
        selectedPlanId === "pro"
          ? `Pro Creator (${billingCycle === "annual" ? "Annual" : "Monthly"})`
          : `Agency Team (${billingCycle === "annual" ? "Annual" : "Monthly"})`;

      const generatedSub: SubscriptionDetails = {
        planId:
          selectedPlanId === "pro"
            ? billingCycle === "annual"
              ? "pro_annual"
              : "pro_monthly"
            : billingCycle === "annual"
            ? "agency_annual"
            : "agency_monthly",
        planName,
        amount: finalTotal,
        billingCycle,
        invoiceId: `INV-${now.getFullYear()}-PC${Math.floor(1000 + Math.random() * 9000)}`,
        activatedAt: now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        renewsAt: renewal.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        paymentMethod:
          paymentMethod === "card"
            ? "Credit Card (Visa •••• 4242)"
            : paymentMethod === "apple_pay"
            ? "Apple Pay"
            : paymentMethod === "google_pay"
            ? "Google Pay"
            : "PayPal",
        lastFour: paymentMethod === "card" ? "4242" : undefined,
      };

      setCompletedSub(generatedSub);
      setCurrentStep("success");

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}

      onUpgradeSuccess(generatedSub);
    }, 1800);
  };

  const handleCancelClick = () => {
    if (onCancelSubscription) {
      onCancelSubscription();
      setShowCancelConfirm(false);
      onClose();
    }
  };

  return (
    <div
      id="pro-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        id="pro-modal"
        className="relative w-full max-w-2xl my-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-5 sm:p-6 shrink-0 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                  PostCraft Subscription Paywall
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {currentStep === "manage"
                    ? "Manage Your Pro Subscription"
                    : currentStep === "checkout"
                    ? "Complete Your Subscription"
                    : currentStep === "processing"
                    ? "Authorizing Payment..."
                    : currentStep === "success"
                    ? "Subscription Activated!"
                    : "Upgrade to PostCraft Pro"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-pro-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reason Alert Banner (if triggered by hitting quota or clicking 2K) */}
          {currentStep === "plan_selection" && reason === "quota_exhausted" && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Daily Free Limit Reached:</strong> You have used all 5 free campaigns today.
                Upgrade below to unlock unlimited generations immediately.
              </span>
            </div>
          )}

          {currentStep === "plan_selection" && reason === "2k_resolution" && (
            <div className="mt-3 p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong>2K Ultra-HD Visual Synthesis</strong> is reserved for Pro Creator accounts. Upgrade to unlock maximum clarity.
              </span>
            </div>
          )}
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* STEP 1: PLAN SELECTION */}
          {currentStep === "plan_selection" && (
            <div className="space-y-6">
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      billingCycle === "monthly"
                        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annual")}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      billingCycle === "annual"
                        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white leading-none">
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pro Creator Plan Card */}
                <div
                  className={`p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedPlanId === "pro"
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                  }`}
                  onClick={() => setSelectedPlanId("pro")}
                >
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
                    MOST POPULAR
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Pro Creator</h3>
                        <p className="text-[11px] text-zinc-500">For active founders & creators</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                        ${billingCycle === "annual" ? baseAnnualPro : baseMonthlyPro}
                      </span>
                      <span className="text-xs text-zinc-500">/ month</span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        $180 billed annually (Save $48/yr)
                      </p>
                    )}

                    <ul className="mt-4 space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span><strong>Unlimited</strong> AI campaign generations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span><strong>1K & 2K Ultra-HD</strong> visual synthesis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>AI Post Polisher ('Punchier', 'Stronger Hook')</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>1-Click Campaign ZIP bundle downloads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Priority Gemini 2.5 Flash token queue</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCheckout("pro");
                    }}
                    className="w-full mt-5 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Continue with Pro Creator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Agency & Team Plan Card */}
                <div
                  className={`p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedPlanId === "agency"
                      ? "border-purple-600 dark:border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 shadow-md ring-2 ring-purple-500/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                  }`}
                  onClick={() => setSelectedPlanId("agency")}
                >
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-xs">
                    AGENCY & TEAMS
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Agency Studio</h3>
                        <p className="text-[11px] text-zinc-500">For multi-client marketing agencies</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                        ${billingCycle === "annual" ? baseAnnualAgency : baseMonthlyAgency}
                      </span>
                      <span className="text-xs text-zinc-500">/ month</span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        $468 billed annually (Save $120/yr)
                      </p>
                    )}

                    <ul className="mt-4 space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <li className="flex items-center gap-2 font-medium text-purple-600 dark:text-purple-400">
                        <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span><strong>Everything in Pro Creator</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span><strong>Unlimited Brand Kits</strong> (Client profiles)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>5 Team workspace seats</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Custom API webhook endpoints</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Dedicated Slack channel & 1-hr support</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCheckout("agency");
                    }}
                    className="w-full mt-5 py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Continue with Agency Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Free vs Pro Comparison Snapshot */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
                <div className="font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Why upgrading pays for itself on day 1:</span>
                </div>
                <p>
                  A single ghostwriter or agency charges $500–$2,000/month for weekly LinkedIn & Twitter content.
                  PostCraft Pro provides endless, high-converting social campaigns with bespoke visuals in under 10 seconds.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: CHECKOUT & PAYMENT METHOD */}
          {currentStep === "checkout" && (
            <div className="space-y-6 animate-in fade-in">
              <button
                type="button"
                onClick={() => setCurrentStep("plan_selection")}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1.5 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Selected Plan</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Form: Payment Details */}
                <div className="md:col-span-7 space-y-4">
                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "card", label: "Credit Card", icon: CreditCard },
                        { id: "apple_pay", label: "Apple Pay", icon: Zap },
                        { id: "google_pay", label: "Google Pay", icon: Zap },
                        { id: "paypal", label: "PayPal", icon: Lock },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSel = paymentMethod === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setPaymentMethod(item.id as any)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                              isSel
                                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[11px] truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-3 p-4 rounded-2xl bg-zinc-50/60 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="e.g. Jane Doe"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 •••• •••• 4242"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                            Expiration (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                            CVC / CVV
                          </label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                            Country
                          </label>
                          <select
                            value={billingCountry}
                            onChange={(e) => setBillingCountry(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="US">United States (US)</option>
                            <option value="UK">United Kingdom (UK)</option>
                            <option value="CA">Canada (CA)</option>
                            <option value="DE">Germany (DE)</option>
                            <option value="IN">India (IN)</option>
                            <option value="SG">Singapore (SG)</option>
                            <option value="AU">Australia (AU)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                            Postal / ZIP Code
                          </label>
                          <input
                            type="text"
                            value={billingZip}
                            onChange={(e) => setBillingZip(e.target.value)}
                            placeholder="ZIP code"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                          Save card securely for automatic renewals (Cancel anytime)
                        </span>
                      </label>
                    </div>
                  )}

                  {paymentMethod !== "card" && (
                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        You will be securely redirected to authorize payment via{" "}
                        <strong>
                          {paymentMethod === "apple_pay"
                            ? "Apple Pay"
                            : paymentMethod === "google_pay"
                            ? "Google Pay"
                            : "PayPal"}
                        </strong>.
                      </p>
                    </div>
                  )}

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="pt-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          placeholder="Promo code (e.g. LAUNCH50)"
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
                        />
                        <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{promoError}</p>
                    )}
                    {appliedPromo && (
                      <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs">
                        <span className="font-semibold">
                          Code '{appliedPromo.code}' applied (-{appliedPromo.discountPercent}%)
                        </span>
                        <button
                          type="button"
                          onClick={() => setAppliedPromo(null)}
                          className="text-[11px] underline hover:text-emerald-900 dark:hover:text-emerald-100"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Right Column: Order Summary & Authorize Button */}
                <div className="md:col-span-5 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Order Summary
                  </h4>

                  <div className="space-y-2 text-xs border-b border-zinc-200 dark:border-zinc-700/80 pb-3">
                    <div className="flex items-center justify-between text-zinc-800 dark:text-zinc-200">
                      <span>
                        {selectedPlanId === "pro" ? "Pro Creator Plan" : "Agency Studio Plan"}{" "}
                        ({billingCycle === "annual" ? "Annual" : "Monthly"})
                      </span>
                      <span className="font-semibold">${rawSubtotal.toFixed(2)}</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Promo Discount ({appliedPromo.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-zinc-500">
                      <span>Estimated Taxes (VAT/GST)</span>
                      <span>$0.00</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      Total Due Today
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${finalTotal.toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-zinc-400">
                        {billingCycle === "annual" ? "Billed once per year" : "Billed monthly"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-pay-and-activate"
                    onClick={handleProcessPayment}
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize & Pay ${finalTotal.toFixed(2)}</span>
                  </button>

                  {/* Trust & Guarantee Badges */}
                  <div className="pt-2 space-y-2 border-t border-zinc-200 dark:border-zinc-750 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>256-Bit Bank Grade SSL Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>14-Day Money Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Cancel Anytime with 1 Click</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING SCREEN */}
          {currentStep === "processing" && (
            <div className="py-12 px-4 text-center space-y-6 animate-in fade-in">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Processing Secure Payment
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Please do not refresh or close this window...
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2 text-left text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2 font-medium">
                  {processingStage >= 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-400" />
                  )}
                  <span>1. Contacting payment gateway...</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  {processingStage >= 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-400" />
                  )}
                  <span>2. Verifying card & 3D Secure...</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  {processingStage >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-400" />
                  )}
                  <span>3. Activating unlimited Pro license...</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS & RECEIPT */}
          {currentStep === "success" && completedSub && (
            <div className="space-y-6 text-center animate-in zoom-in-95">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Welcome to PostCraft Pro!
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Your payment was authorized and your account now has unlimited generation privileges.
                </p>
              </div>

              {/* Invoice Receipt Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
                  <span className="font-bold text-zinc-900 dark:text-white">Official Tax Invoice</span>
                  <span className="font-mono text-[11px] text-zinc-500">{completedSub.invoiceId}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-zinc-600 dark:text-zinc-400">
                  <div>
                    <span className="block text-[10px] text-zinc-400">Plan:</span>
                    <strong className="text-zinc-900 dark:text-white">{completedSub.planName}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400">Amount Paid:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      ${completedSub.amount.toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400">Payment Method:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{completedSub.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400">Next Renewal:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{completedSub.renewsAt}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-start-pro-studio"
                onClick={onClose}
                className="w-full max-w-md mx-auto py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Launch Studio & Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 5: MANAGE ACTIVE SUBSCRIPTION (For users already on Pro) */}
          {currentStep === "manage" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    <span>PRO SUBSCRIPTION ACTIVE</span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    You have unlimited AI generations, 2K visual upscaling, and priority inference.
                  </p>
                </div>
              </div>

              {/* Subscription Breakdown */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-3">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">
                      {subscription?.planName || "PostCraft Pro Creator"}
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Invoice: {subscription?.invoiceId || "INV-2026-ACTIVE"}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-zinc-600 dark:text-zinc-400 pt-1">
                  <div>
                    <span className="block text-[10px] text-zinc-400">Payment Method</span>
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      {subscription?.paymentMethod || "Credit Card (Visa •••• 4242)"}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400">Next Billing Renewal</span>
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      {subscription?.renewsAt || "Next Month"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {!showCancelConfirm ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-center"
                    >
                      Return to Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-3 text-xs">
                    <p className="text-red-800 dark:text-red-200 font-semibold">
                      Are you sure you want to cancel your Pro membership?
                    </p>
                    <p className="text-red-600 dark:text-red-400">
                      Your plan will downgrade to the Free Starter tier (5 generations per day, 512px standard visuals).
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCancelClick}
                        className="py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                      >
                        Confirm Cancellation
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(false)}
                        className="py-2 px-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 transition-colors"
                      >
                        Keep Subscription
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
