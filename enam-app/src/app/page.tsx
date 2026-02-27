"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Wheat, ShieldCheck, TrendingUp, MapPin, Users, ArrowRight,
  Star, ChevronRight, Play, Award, Globe2, Zap, Lock, BarChart3,
} from "lucide-react";
import { MSP_RATES, AC_TO_INR } from "@/lib/agriCredit";

const TICKER_ITEMS = [
  { crop: "Wheat", state: "Punjab", price: 2275, change: +2.3 },
  { crop: "Rice", state: "Odisha", price: 2300, change: -0.8 },
  { crop: "Maize", state: "Karnataka", price: 2090, change: +1.5 },
  { crop: "Soybean", state: "MP", price: 4892, change: +3.1 },
  { crop: "Cotton", state: "Gujarat", price: 7121, change: -1.2 },
  { crop: "Mustard", state: "Rajasthan", price: 5950, change: +0.9 },
  { crop: "Onion", state: "Maharashtra", price: 800, change: +5.4 },
  { crop: "Tomato", state: "AP", price: 600, change: -2.1 },
];

const TESTIMONIALS = [
  {
    name: "Ramilabai Deshmukh",
    state: "Maharashtra",
    crop: "Sugarcane",
    text: "Pehle 3 haath badke bikri hoti thi. eNAM se seedha buyer milta hai. 18% zyada paisa mila!",
    acEarned: 2840,
    avatar: "👩‍🌾",
    rating: 5,
  },
  {
    name: "Gurpreet Singh",
    state: "Punjab",
    crop: "Wheat",
    text: "AgriCredit system ne barter ko digital bana diya. AbRailway Station pe bhi AC use kar sakta hoon.",
    acEarned: 5200,
    avatar: "👨‍🌾",
    rating: 5,
  },
  {
    name: "Lakshmi Narayana",
    state: "Andhra Pradesh",
    crop: "Rice",
    text: "Escrow system se trust badhta hai. Buyer ka payment secure hai — humara crop secure hai.",
    acEarned: 3650,
    avatar: "🧑‍🌾",
    rating: 5,
  },
  {
    name: "Fatima Sheikh",
    state: "West Bengal",
    crop: "Jute",
    text: "Mobile pe OTP se login. Koi agent nahi, koi commission agent nahi. Direct price discovery!",
    acEarned: 1890,
    avatar: "👩‍🌾",
    rating: 4,
  },
];

const STATS = [
  { label: "Mandis Connected", value: "1,522", icon: "🏪", suffix: "+" },
  { label: "States Covered", value: "23", icon: "🗺️", suffix: "" },
  { label: "Farmers Registered", value: "1.8Cr", icon: "👨‍🌾", suffix: "+" },
  { label: "AgriCredits Traded", value: "₹2.4L Cr", icon: "💰", suffix: "+" },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Register with Mobile OTP",
    desc: "Quick 60-second registration using your mobile number. Get 50 AgriCredits as welcome bonus.",
    icon: "📱",
    color: "#16a34a",
  },
  {
    step: 2,
    title: "List Your Surplus Crop",
    desc: "Upload a photo, enter quantity and grade. Your listing is MSP-valued in AgriCredits automatically.",
    icon: "📸",
    color: "#059669",
  },
  {
    step: 3,
    title: "Get Community Verified",
    desc: "2 nearby farmers verify your listing. This prevents fake listings and builds trust.",
    icon: "✅",
    color: "#0284c7",
  },
  {
    step: 4,
    title: "Trade in Escrow Safety",
    desc: "Buyer's AgriCredits are locked in escrow. You confirm handover → Credits release instantly.",
    icon: "🔐",
    color: "#7c3aed",
  },
];

const FEATURES = [
  {
    icon: <BarChart3 size={24} />,
    title: "MSP-Pegged AgriCredits",
    desc: "1 AC = ₹22.75 (wheat MSP per kg). Inflation-proof digital currency for farmers.",
    highlight: "Anti-Inflation",
  },
  {
    icon: <Lock size={24} />,
    title: "Escrow Protection",
    desc: "Buyer's payment locked until delivery confirmation. Zero fraud, zero risk.",
    highlight: "100% Secure",
  },
  {
    icon: <MapPin size={24} />,
    title: "20km Geo Radius",
    desc: "Trade only with farmers within 20km. Practical delivery, local trust networks.",
    highlight: "Local First",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Community Verification",
    desc: "2 verified farmers endorse each listing. Fake listings impossible to mint credits.",
    highlight: "Anti-Fake",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Supply-Demand Dashboard",
    desc: "Real-time crop surplus/deficit analytics per village. Know market before selling.",
    highlight: "Price Intelligence",
  },
  {
    icon: <Zap size={24} />,
    title: "Instant OTP Login",
    desc: "Works on KaiOS feature phones. No app download needed. Just mobile + OTP.",
    highlight: "Rural Friendly",
  },
];

function TickerItem({ item }: { item: typeof TICKER_ITEMS[0] }) {
  return (
    <span className="inline-flex items-center gap-2 mx-6 text-sm font-medium" style={{ color: "#166534" }}>
      <Wheat size={14} style={{ color: "#16a34a" }} />
      <strong>{item.crop}</strong>
      <span style={{ color: "#6b7280" }}>({item.state})</span>
      <span>₹{item.price}/qtl</span>
      <span style={{ color: item.change > 0 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
        {item.change > 0 ? "▲" : "▼"} {Math.abs(item.change)}%
      </span>
    </span>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => (t + 1) % TICKER_ITEMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((t) => (t + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-hero-gradient min-h-screen">

      {/* ── PRICE TICKER ── */}
      <div
        className="py-2 overflow-hidden relative"
        style={{ background: "#14532d", color: "white" }}
      >
        <div className="flex items-center">
          <div
            className="flex-shrink-0 px-4 py-0.5 text-xs font-bold uppercase tracking-wider z-10"
            style={{ background: "#f59e0b", color: "white" }}
          >
            Live MSP 📈
          </div>
          <div
            className="overflow-hidden flex-1"
            style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
          >
            <div className="flex whitespace-nowrap" style={{ animation: "spin-slow 30s linear infinite" }}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <TickerItem key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}
            >
              <Globe2 size={14} />
              Government of India • SFAC Initiative
              <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "#16a34a", color: "white" }}>
                1522 Mandis
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#14532d" }}>
              India&apos;s{" "}
              <span className="text-green-gradient">Digital Agri</span>
              <br />
              <span className="text-green-gradient">Exchange</span>
            </h1>

            <p className="text-lg md:text-xl mb-8" style={{ color: "#166534" }}>
              Trade crops, earn <strong>AgriCredits pegged to MSP</strong>, and
              connect with 1.8 crore farmers across 23 states. No middlemen.
              Full transparency.
            </p>

            {/* AC Value Display */}
            <div
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
              style={{ background: "#fef3c7", border: "1px solid #fde68a" }}
            >
              <div className="text-2xl">🪙</div>
              <div>
                <div className="text-xs font-semibold uppercase" style={{ color: "#92400e" }}>Current AgriCredit Rate</div>
                <div className="text-xl font-bold" style={{ color: "#92400e" }}>1 AC = ₹{AC_TO_INR} (MSP Pegged)</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary text-lg px-8 py-3.5">
                Start Trading Free
                <ArrowRight size={18} />
              </Link>
              <Link href="/marketplace" className="btn-secondary text-lg px-8 py-3.5">
                <Play size={16} />
                View Marketplace
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { label: "Avg Farmer Gain", value: "+18%" },
                { label: "Platform Fee", value: "1% Only" },
                { label: "Settlement Time", value: "< 24h" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold" style={{ color: "#16a34a" }}>{s.value}</div>
                  <div className="text-xs" style={{ color: "#6b7280" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(22, 163, 74, 0.2) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  transform: "scale(1.1)",
                }}
              />
              <Image
                src="/hero-farmer.png"
                alt="Farmer with AgriCredit digital marketplace"
                width={500}
                height={500}
                className="relative rounded-3xl animate-float"
                style={{ boxShadow: "0 20px 60px rgba(22, 163, 74, 0.2)" }}
                priority
              />
              {/* Floating cards */}
              <div
                className="absolute -top-4 -right-4 px-3 py-2 rounded-xl card-glass animate-bounce-subtle"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="text-xs font-semibold" style={{ color: "#166534" }}>Live Trade</div>
                <div className="font-bold text-sm" style={{ color: "#16a34a" }}>+₹3,240 earned</div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl card-glass animate-bounce-subtle"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="text-xs font-semibold" style={{ color: "#166534" }}>AgriCredits</div>
                <div className="ac-badge text-sm">🌾 1,248 AC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section style={{ background: "linear-gradient(135deg, #14532d, #166534)" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {s.value}{s.suffix}
                </div>
                <div className="text-green-300 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3" style={{ background: "#dcfce7", color: "#16a34a" }}>
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif", color: "#14532d" }}>
            Trade in <span className="text-green-gradient">4 Easy Steps</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#166534" }}>
            From farm to payment in under 24 hours. No paperwork, no middlemen.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, #16a34a, transparent)", zIndex: 0 }}
          />

          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="relative z-10">
              <div className="card-solid p-6 text-center h-full">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
                >
                  {step.icon}
                </div>
                <div
                  className="absolute -top-3 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: step.color }}
                >
                  {step.step}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#14532d" }}>{step.title}</h3>
                <p className="text-sm" style={{ color: "#4b7c5c" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{ background: "#f0fdf4" }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif", color: "#14532d" }}>
              Why <span className="text-green-gradient">eNAM AgriMarket</span>?
            </h2>
            <p className="text-lg" style={{ color: "#166534" }}>Built for India&apos;s 14 crore farmers. Policy-grade innovation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-glass p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #16a34a, #059669)", color: "white" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold" style={{ color: "#14532d" }}>{f.title}</h3>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#dcfce7", color: "#16a34a" }}
                    >
                      {f.highlight}
                    </span>
                    <p className="text-sm mt-2" style={{ color: "#4b7c5c" }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGRICREDIT EXPLAINER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4" style={{ background: "#fef3c7", color: "#92400e" }}>
              🪙 AgriCredit Economy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#14532d" }}>
              The Credit System That{" "}
              <span className="text-green-gradient">Protects Farmers</span>
            </h2>
            <div className="space-y-4">
              {[
                { title: "MSP Pegging = Stable Value", desc: "1 AC = ₹22.75 (wheat MSP per kg). Government revises MSP annually — your AgriCredits stay valuable.", icon: "📌" },
                { title: "Escrow = Zero Risk Trades", desc: "Buyer's ACs locked when they bid. You deliver crop → ACs auto-release. No payment delays.", icon: "🔐" },
                { title: "1% Fee = Platform Sustainability", desc: "Trade 2000 AC? Pay 20 AC. Seller receives 1980 AC. Transparent, fair, sustainable.", icon: "💱" },
                { title: "Earn While Participating", desc: "List (+5 AC), Complete trade (+10 AC), Verify farmer (+15 AC), Refer friend (+50 AC).", icon: "📈" },
                { title: "Anti-Hoarding Mechanism", desc: "Credits inactive 12+ months decay at 2%/month. Keeps economy liquid and active.", icon: "⏱️" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="font-semibold mb-0.5" style={{ color: "#14532d" }}>{item.title}</div>
                    <div className="text-sm" style={{ color: "#4b7c5c" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual credit card representation */}
          <div className="flex justify-center">
            <div style={{
              background: "linear-gradient(135deg, #14532d, #059669)",
              borderRadius: "24px",
              padding: "32px",
              width: "320px",
              boxShadow: "0 20px 60px rgba(22, 163, 74, 0.3)",
              color: "white",
            }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-green-300 text-xs font-semibold">eNAM AgriCredit</div>
                  <div className="text-2xl font-bold mt-1">🌾 2,840 AC</div>
                  <div className="text-green-300 text-sm mt-0.5">≈ ₹64,610</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl">🪙</div>
                  <div className="text-green-300 text-xs mt-1">MSP Pegged</div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-green-300">Last Trade</span>
                  <span>150 AC (Wheat)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-300">Escrow Locked</span>
                  <span>320 AC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-300">Trust Score</span>
                  <span>⭐ 87/100</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
                <div className="text-green-300 text-xs mb-1">Farmer</div>
                <div className="font-semibold">Gurpreet Singh • Punjab</div>
                <div className="text-green-300 text-xs mt-1">Est. Jan 2024 • Verified ✅</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: "#14532d" }}>
              Kisan Speaks 🌾
            </h2>
            <p style={{ color: "#166534" }}>Real farmers, real earnings, real change.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`card-solid p-6 transition-all duration-500 ${activeTab === i ? "ring-2 ring-green-500 shadow-lg" : ""}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#14532d" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "#6b7280" }}>{t.state} • {t.crop}</div>
                    <div className="flex mt-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-4" style={{ color: "#4b7c5c" }}>&ldquo;{t.text}&rdquo;</p>
                <div className="ac-badge text-xs">🌾 {t.acEarned.toLocaleString()} AC earned</div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: activeTab === i ? "#16a34a" : "#bbf7d0", width: activeTab === i ? "24px" : "8px" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── MSP PRICE TABLE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif", color: "#14532d" }}>
            Live MSP → AgriCredit <span className="text-green-gradient">Conversion</span>
          </h2>
          <p style={{ color: "#166534" }}>Government MSP 2024-25 season. Automatically calculated.</p>
        </div>
        <div className="card-solid overflow-hidden">
          <div
            className="grid grid-cols-4 px-6 py-3 text-xs font-bold uppercase"
            style={{ background: "#14532d", color: "white" }}
          >
            <span>Crop</span>
            <span>MSP/Quintal</span>
            <span>MSP/Kg</span>
            <span>Value in AC</span>
          </div>
          {Object.entries(MSP_RATES).slice(0, 10).map(([crop, mspPerQtl], i) => {
            const mspPerKg = mspPerQtl / 100;
            const acPerKg = (mspPerKg / AC_TO_INR).toFixed(2);
            return (
              <div
                key={crop}
                className="grid grid-cols-4 px-6 py-3 text-sm"
                style={{
                  background: i % 2 === 0 ? "white" : "#f0fdf4",
                  borderBottom: "1px solid #e0f2e9",
                  color: "#166534",
                }}
              >
                <span className="font-medium capitalize">{crop}</span>
                <span>₹{mspPerQtl.toLocaleString()}</span>
                <span>₹{mspPerKg.toFixed(2)}</span>
                <span className="font-bold" style={{ color: "#16a34a" }}>{acPerKg} AC</span>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-6">
          <Link href="/prices" className="btn-secondary inline-flex items-center gap-2 px-6 py-3">
            View All 190+ Commodities <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #14532d, #059669)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-4">🌾</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Ready to Change How India Farms?
          </h2>
          <p className="text-green-200 text-lg mb-8">
            Join 1.8 crore farmers already trading on eNAM. Get 50 AgriCredits free on signup.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-gold text-lg px-10 py-4">
              Register as Farmer — Free
              <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-10 py-4" style={{ borderColor: "white", color: "white" }}>
              Already registered? Login
            </Link>
          </div>
          <p className="text-green-300 text-sm mt-6">
            🏛️ Government of India Initiative • Ministry of Agriculture & Farmers&apos; Welfare
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a2e18", color: "#a7f3c2" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="eNAM" width={36} height={36} className="rounded-lg" />
                <span className="font-bold text-white text-lg">eNAM AgriMarket</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#4ade80" }}>
                National Agriculture Market (eNAM) is a pan-India electronic trading portal for agricultural commodities under Ministry of Agriculture, Govt. of India.
              </p>
              <div className="mt-4 text-sm" style={{ color: "#4ade80" }}>
                📞 Toll Free: 1800 270 0224
              </div>
            </div>

            {[
              {
                title: "Quick Links",
                links: [
                  { label: "Home", href: "/" },
                  { label: "Marketplace", href: "/marketplace" },
                  { label: "Live Prices", href: "/prices" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "About eNAM", href: "/about" },
                ],
              },
              {
                title: "Stakeholders",
                links: [
                  { label: "Farmers", href: "/register?role=farmer" },
                  { label: "Traders", href: "/register?role=trader" },
                  { label: "APMC Officials", href: "/register?role=apmc" },
                  { label: "FPOs", href: "/register?role=fpo" },
                  { label: "eNAM Mandis", href: "/mandis" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { label: "AgriCredit Guide", href: "/guide/agricredit" },
                  { label: "MSP Rates 2024-25", href: "/prices" },
                  { label: "Training Videos", href: "/videos" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Contact Us", href: "/contact" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "#4ade80" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(74, 222, 128, 0.2)", paddingTop: "24px", color: "#4ade80" }} className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>© 2024 National Agriculture Market (eNAM). All rights reserved. SFAC • Ministry of Agriculture & Farmers&apos; Welfare</div>
            <div className="flex items-center gap-4">
              <Award size={16} />
              <span>WCAG 2.1 AA Compliant</span>
              <span>•</span>
              <span>KaiOS Compatible</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
