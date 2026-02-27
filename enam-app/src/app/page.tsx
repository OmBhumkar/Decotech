"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, ShieldCheck, TrendingUp, MapPin, Star,
  ChevronRight, Leaf, Award, Globe, Zap, Lock, BarChart2,
  Wheat, Coins, CheckCircle, Users, Clock, Layers,
  ArrowUpRight, ArrowDownRight, Sprout
} from "lucide-react";
import { MSP_RATES, AC_TO_INR } from "@/lib/agriCredit";

/* ── Data ── */
const TICKER = [
  { crop: "Wheat", state: "Punjab", price: 2275, ch: +2.3 },
  { crop: "Rice", state: "Odisha", price: 2300, ch: -0.8 },
  { crop: "Maize", state: "Karnataka", price: 2090, ch: +1.5 },
  { crop: "Soybean", state: "MP", price: 4892, ch: +3.1 },
  { crop: "Cotton", state: "Gujarat", price: 7121, ch: -1.2 },
  { crop: "Mustard", state: "Rajasthan", price: 5950, ch: +0.9 },
  { crop: "Onion", state: "Maharashtra", price: 800, ch: +5.4 },
  { crop: "Tomato", state: "AP", price: 600, ch: -2.1 },
  { crop: "Groundnut", state: "Gujarat", price: 6783, ch: +1.7 },
];

const STATS = [
  { value: "1,522", label: "Mandis", Icon: Layers },
  { value: "23", label: "States", Icon: Globe },
  { value: "1.8 Cr", label: "Farmers", Icon: Users },
  { value: "₹2.4L Cr", label: "Traded", Icon: TrendingUp },
];

const STEPS = [
  { n: 1, Icon: Sprout, title: "Register Free", desc: "60-second sign-up with mobile OTP. Get 50 AgriCredits as welcome bonus." },
  { n: 2, Icon: Wheat, title: "List Surplus Crop", desc: "Upload photo, enter quantity & grade. MSP valuation auto-calculated in AgriCredits." },
  { n: 3, Icon: Users, title: "Get Verified", desc: "Two nearby farmers endorse your listing. Fake listings can never mint credits." },
  { n: 4, Icon: ShieldCheck, title: "Trade in Escrow", desc: "Buyer's credits locked at bid. Credits auto-release only after you confirm delivery." },
];

const FEATURES = [
  { Icon: Coins, title: "MSP-Pegged Credits", sub: "Anti-Inflation", desc: "1 AC = ₹22.75 (wheat MSP/kg). Government MSP revisions keep your credits valuable." },
  { Icon: Lock, title: "Escrow Protection", sub: "Zero-Risk Trades", desc: "Buyer's payment locked until delivery confirmed. No fraud, no delays — mathematically guaranteed." },
  { Icon: MapPin, title: "20km Geo Radius", sub: "Local First", desc: "Trade within 20km radius. Practical delivery windows + strong local trust networks." },
  { Icon: ShieldCheck, title: "Community Verification", sub: "Anti-Fake", desc: "2 verified farmers endorse each listing before credits are created. No fake produce." },
  { Icon: BarChart2, title: "Supply-Demand Intel", sub: "Price Intelligence", desc: "Live surplus/deficit analytics per village. Know the market before you sell." },
  { Icon: Zap, title: "Works on Feature Phones", sub: "Rural Friendly", desc: "OTP keypad designed for KaiOS devices. No app download, minimal data usage." },
];

const TESTIMONIALS = [
  { name: "Ramilabai Deshmukh", state: "Maharashtra", crop: "Sugarcane", quote: "AgriTrade se seedha buyer milta hai — 18% zyada paisa mila. Pehle mandiwaala commission mein le jaata tha.", ac: 2840, stars: 5 },
  { name: "Gurpreet Singh", state: "Punjab", crop: "Wheat", quote: "AgriCredit system ne barter ko digital bana diya. Wallet mein hamesha clear balance dikhta hai.", ac: 5200, stars: 5 },
  { name: "Lakshmi Narayana", state: "Andhra Pradesh", crop: "Rice", quote: "Escrow se trust badhta hai. Mera crop secure hai, buyer ka payment secure hai — dono khush.", ac: 3650, stars: 5 },
  { name: "Fatima Khan", state: "West Bengal", crop: "Jute", quote: "Mobile pe OTP se login hota hai. Koi middle-man nahi, seedha price discovery. Bahut acha!", ac: 1890, stars: 4 },
];

const MSP_TABLE = Object.entries(MSP_RATES).slice(0, 8).map(([crop, msp]) => ({
  crop: crop.charAt(0).toUpperCase() + crop.slice(1),
  msp,
  acPerKg: +(msp / 100 / AC_TO_INR).toFixed(2),
}));

export default function HomePage() {
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveT(v => (v + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "var(--bg-canvas)" }}>

      {/* ═══════════════════════════ TICKER ═══════════════════════════ */}
      <div style={{ background: "var(--green-900)", overflow: "hidden", padding: "9px 0", borderBottom: "1px solid var(--green-800)" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            flexShrink: 0,
            padding: "3px 16px",
            background: "var(--amber-500)",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            zIndex: 2,
          }}>
            Live MSP
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div className="ticker-track" style={{ padding: "0 24px" }}>
              {[...TICKER, ...TICKER].map((t, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    marginRight: 40, fontSize: 13, fontWeight: 500, color: "var(--green-200)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Wheat size={13} color="var(--green-400)" />
                  <strong style={{ color: "white" }}>{t.crop}</strong>
                  <span style={{ color: "var(--green-400)", fontSize: 12 }}>{t.state}</span>
                  <span>₹{t.price.toLocaleString()}/qtl</span>
                  <span style={{
                    color: t.ch > 0 ? "#4ade80" : "#f87171",
                    fontWeight: 700, fontSize: 12,
                    display: "flex", alignItems: "center", gap: 2,
                  }}>
                    {t.ch > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(t.ch)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section style={{ background: "linear-gradient(165deg, #edf8f0 0%, #e2f4e7 60%, #d4edd9 100%)", paddingTop: 80, paddingBottom: 96 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* Left */}
            <div className="anim-fadeUp">
              <div className="section-chip">
                <Globe size={12} />
                Government of India · SFAC Initiative
              </div>

              <h1 className="display" style={{ marginBottom: 20, letterSpacing: "-0.02em" }}>
                India&apos;s Digital<br />
                <span className="text-gradient">Agriculture</span><br />
                Exchange
              </h1>

              <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                Trade commodities, earn <strong style={{ color: "var(--text-secondary)" }}>AgriCredits pegged to Government MSP</strong>,
                and connect directly with 1.8 crore farmers across 23 states. No middlemen.
              </p>

              {/* AC rate pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                padding: "12px 20px", borderRadius: 12, marginBottom: 32,
                background: "white", border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--amber-500), var(--amber-600))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Coins size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>AgriCredit Rate</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>1 AC = ₹{AC_TO_INR} <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 13 }}>(MSP Pegged)</span></div>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 44 }}>
                <Link href="/register" className="btn btn-primary btn-lg">
                  Start Trading Free
                  <ArrowRight size={18} />
                </Link>
                <Link href="/marketplace" className="btn btn-outline btn-lg">
                  Browse Marketplace
                </Link>
              </div>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[
                  { v: "+18%", l: "Avg Farmer Gain" },
                  { v: "1%", l: "Platform Fee" },
                  { v: "<24h", l: "Settlement" },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: "var(--green-700)" }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero image */}
            <div className="anim-fadeUp delay-200 hide-mobile" style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              {/* glow backdrop */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at center, rgba(34,197,94,0.18) 0%, transparent 65%)",
                filter: "blur(40px)",
                transform: "scale(1.2)",
              }} />
              <Image
                src="/hero-farmer.png"
                alt="Farmer with AgriCredit marketplace"
                width={480}
                height={480}
                priority
                className="anim-floatSlow"
                style={{ borderRadius: 28, position: "relative", boxShadow: "0 24px 80px rgba(15,45,26,0.18)" }}
              />

              {/* Floating glass cards */}
              <div className="glass anim-float" style={{ position: "absolute", top: 16, right: -16, padding: "12px 16px", animation: "float 4s ease-in-out infinite" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 2 }}>Live Trade</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green-700)" }}>+₹3,240 earned</div>
              </div>
              <div className="glass" style={{ position: "absolute", bottom: 24, left: -16, padding: "12px 16px", animation: "float 4.5s ease-in-out 1s infinite" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Wallet Balance</div>
                <div className="ac-pill" style={{ fontSize: 13 }}><Coins size={13} /> 2,840 AC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STATS BAND ═══════════════════════════ */}
      <section style={{ background: "var(--green-900)", padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                textAlign: "center", padding: "0 32px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.Icon size={18} color="var(--green-300)" />
                  </div>
                </div>
                <div className="stat-number" style={{ color: "white", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--green-300)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <div className="section-chip"><Zap size={12} /> Simple Process</div>
            <h2 className="heading" style={{ marginBottom: 16 }}>Trade in 4 Easy Steps</h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)" }}>From farm to payment in under 24 hours. No paperwork, no middlemen.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative" }}>
            {/* connector */}
            <div style={{ position: "absolute", top: 60, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg, transparent, var(--green-300), transparent)", zIndex: 0 }} />

            {STEPS.map((s, i) => (
              <div key={s.n} className="anim-fadeUp" style={{ animationDelay: `${i * 0.1}s`, position: "relative", zIndex: 1 }}>
                <div className="card" style={{ padding: 28, textAlign: "center" }}>
                  {/* Step number */}
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    width: 28, height: 28, borderRadius: "50%", background: "var(--green-600)",
                    color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                    border: "3px solid var(--bg-surface)",
                  }}>
                    {s.n}
                  </div>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, margin: "8px auto 16px",
                    background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <s.Icon size={24} color="var(--green-600)" strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURES ═══════════════════════════ */}
      <section className="section" style={{ background: "var(--bg-canvas)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 56px" }}>
            <div className="section-chip"><Award size={12} /> Why AgriTrade</div>
            <h2 className="heading" style={{ marginBottom: 12 }}>Policy-Grade Innovation</h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)" }}>Built for India&apos;s 14 crore farmers. Every feature has a reason.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card anim-fadeUp" style={{ padding: "28px 28px 28px 28px", animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="icon-box" style={{ background: "var(--green-50)", color: "var(--green-700)", borderRadius: 12 }}>
                    <f.Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div>
                    <span className="badge badge-green" style={{ marginBottom: 8, fontSize: 10 }}>{f.sub}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ AGRICREDIT EXPLAINER ═══════════════════════════ */}
      <section className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            {/* Left — copy */}
            <div>
              <div className="section-chip"><Coins size={12} /> AgriCredit Economy</div>
              <h2 className="heading" style={{ marginBottom: 20 }}>
                The Credit System That<br />
                <span className="text-gradient">Protects Farmers</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { Icon: Coins, title: "MSP Pegging = Stable Value", desc: "1 AC = ₹22.75 (wheat MSP per kg). Government revises MSP annually — your credits adjust too." },
                  { Icon: Lock, title: "Escrow = Zero Risk", desc: "Credits locked at bid. You deliver crop → credits auto-release. No payment delays, no disputes." },
                  { Icon: BarChart2, title: "1% Fee = Sustainable Platform", desc: "Trade 2000 AC? Pay 20 AC. You keep 1980 AC. Traditional mandi charges 2–5% — we're always cheaper." },
                  { Icon: TrendingUp, title: "Earn While Participating", desc: "List (+5 AC), Complete trade (+10 AC), Verify farmer (+15 AC), Refer (+50 AC)." },
                  { Icon: Clock, title: "Anti-Hoarding Mechanism", desc: "Credits inactive 12+ months decay at 2%/month. Keeps the economy liquid." },
                ].map(item => (
                  <div key={item.title} style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <item.Icon size={16} color="var(--green-600)" strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — card mockup */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: 320,
                background: "linear-gradient(145deg, var(--green-900) 0%, var(--green-700) 100%)",
                borderRadius: 28,
                padding: 36,
                boxShadow: "0 28px 80px rgba(15, 45, 26, 0.30)",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* bg circles */}
                <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ position: "absolute", bottom: -60, left: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, position: "relative" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green-300)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>AgriTrade</div>
                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 3 }}>2,840 AC</div>
                    <div style={{ fontSize: 14, color: "var(--green-300)" }}>≈ ₹{(2840 * AC_TO_INR).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Coins size={22} color="var(--green-300)" />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, position: "relative" }}>
                  {[["Last Trade", "150 AC (Wheat)"], ["In Escrow", "320 AC"], ["Trust Score", "87 / 100"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "var(--green-300)" }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 18, position: "relative" }}>
                  <div style={{ fontSize: 11, color: "var(--green-400)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Farmer</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Gurpreet Singh · Punjab</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                    <CheckCircle size={13} color="var(--green-400)" />
                    <span style={{ fontSize: 12, color: "var(--green-300)" }}>Community Verified · Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */}
      <section className="section" style={{ background: "var(--bg-canvas)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto 52px" }}>
            <div className="section-chip"><Star size={12} /> Farmer Stories</div>
            <h2 className="heading" style={{ marginBottom: 12 }}>Kisan Speaks</h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)" }}>Real farmers, real earnings, real change.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="card"
                style={{
                  padding: 24,
                  border: activeT === i ? "2px solid var(--green-400)" : "1px solid var(--border)",
                  transition: "all 0.4s ease",
                  boxShadow: activeT === i ? "0 8px 32px rgba(22,163,74,0.15)" : "var(--shadow-sm)",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={13} fill="var(--amber-500)" color="var(--amber-500)" />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--green-500), var(--green-700))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Users size={16} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{t.state} · {t.crop}</div>
                  </div>
                </div>
                <div className="ac-pill" style={{ fontSize: 11, marginTop: 14 }}>
                  <Coins size={11} />
                  {t.ac.toLocaleString()} AC earned
                </div>
              </div>
            ))}
          </div>

          {/* Indicator dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveT(i)}
                style={{
                  height: 6, borderRadius: 99, border: "none", cursor: "pointer",
                  background: activeT === i ? "var(--green-600)" : "var(--border)",
                  width: activeT === i ? 24 : 6,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ MSP TABLE ═══════════════════════════ */}
      <section className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-chip"><TrendingUp size={12} /> Price Reference</div>
            <h2 className="heading" style={{ marginBottom: 12 }}>MSP → AgriCredit Conversion</h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)" }}>Government MSP 2024-25. Auto-calculated in real time.</p>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "14px 24px", background: "var(--green-900)" }}>
              {["Commodity", "MSP / Quintal", "MSP / Kg", "Value in AC"].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--green-300)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
              ))}
            </div>
            {MSP_TABLE.map((row, i) => (
              <div
                key={row.crop}
                style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "14px 24px", fontSize: 14,
                  background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-muted)",
                  borderBottom: i < MSP_TABLE.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green-500)", flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.crop}</span>
                </div>
                <span style={{ color: "var(--text-muted)" }}>₹{row.msp.toLocaleString()}</span>
                <span style={{ color: "var(--text-muted)" }}>₹{(row.msp / 100).toFixed(2)}</span>
                <span className="badge badge-green" style={{ width: "fit-content" }}>{row.acPerKg} AC</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/prices" className="btn btn-outline">
              View all 190+ commodities
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA ═══════════════════════════ */}
      <section style={{ background: "linear-gradient(135deg, var(--green-950), var(--green-800))", padding: "96px 0" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Leaf size={28} color="var(--green-300)" />
          </div>
          <h2 className="heading" style={{ color: "white", marginBottom: 16 }}>Ready to Change How India Farms?</h2>
          <p style={{ fontSize: 16, color: "var(--green-200)", marginBottom: 40, lineHeight: 1.7 }}>
            Join 1.8 crore farmers already trading on AgriTrade. 50 AgriCredits credited instantly on signup.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
            <Link href="/register" className="btn btn-amber btn-lg">
              Register as Farmer — Free
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-white btn-lg">
              Sign In
            </Link>
          </div>
          <p style={{ fontSize: 12, color: "var(--green-400)", marginTop: 28, letterSpacing: "0.03em" }}>
            Government of India · Ministry of Agriculture &amp; Farmers&apos; Welfare · SFAC
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer style={{ background: "var(--green-950)", padding: "64px 0 32px", color: "var(--green-200)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Leaf size={18} color="var(--green-300)" />
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "white" }}>AgriTrade</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--green-400)", maxWidth: 280 }}>
                Pan-India electronic trading portal for agricultural commodities under Ministry of Agriculture, Govt. of India.
              </p>
              <div style={{ marginTop: 16, fontSize: 13, color: "var(--green-400)", display: "flex", alignItems: "center", gap: 6 }}>
                Toll Free: 1800 270 0224
              </div>
            </div>

            {[
              {
                title: "Platform",
                links: ["/", "/marketplace", "/prices", "/dashboard", "/about"],
                labels: ["Home", "Marketplace", "Live Prices", "Dashboard", "About"],
              },
              {
                title: "Stakeholders",
                links: ["/register?role=farmer", "/register?role=trader", "/register?role=apmc", "/mandis"],
                labels: ["Farmers", "Traders", "APMC Officials", "AgriTrade Mandis"],
              },
              {
                title: "Resources",
                links: ["/guide/agricredit", "/prices", "/privacy", "/contact"],
                labels: ["AgriCredit Guide", "MSP Rates 2024-25", "Privacy Policy", "Contact Us"],
              },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((href, j) => (
                    <Link
                      key={href}
                      href={href}
                      style={{ fontSize: 13, color: "var(--green-300)", transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "white")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--green-300)")}
                    >
                      {col.labels[j]}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12, color: "var(--green-500)" }}>© 2024 National Agriculture Market (AgriTrade). All rights reserved.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--green-500)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><ShieldCheck size={13} /> WCAG 2.1 AA</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Zap size={13} /> KaiOS Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
