"use client";

import Image from "next/image";
import Link from "next/link";
import { MSP_RATES, AC_TO_INR, CREDIT_REWARDS, PLATFORM_FEE_PCT } from "@/lib/agriCredit";
import { CheckCircle2, Heart, Globe2, Award, Users, Wheat } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen" style={{ background: "#f0fdf4" }}>
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, #14532d, #059669)" }} className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Image src="/logo.png" alt="eNAM" width={80} height={80} className="mx-auto mb-6 rounded-2xl" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                        About eNAM AgriMarket
                    </h1>
                    <p className="text-green-200 text-xl max-w-2xl mx-auto">
                        A Government of India initiative transforming agricultural trade through digital innovation, MSP transparency, and farmer empowerment.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {[
                        {
                            title: "🎯 Vision",
                            content: "To promote uniformity in agriculture marketing by streamlining procedures across integrated markets, removing information asymmetry between buyers and sellers and promoting real time price discovery based on actual demand and supply."
                        },
                        {
                            title: "🚀 Mission",
                            content: "Integration of APMCs across the country through a common online market platform to facilitate pan-India trade in agriculture commodities, providing better price discovery through transparent auction process based on quality of produce along with timely online payment."
                        }
                    ].map((item) => (
                        <div key={item.title} className="card-solid p-6">
                            <h2 className="text-xl font-bold mb-3" style={{ color: "#14532d" }}>{item.title}</h2>
                            <p style={{ color: "#4b7c5c" }}>{item.content}</p>
                        </div>
                    ))}
                </div>

                {/* AgriCredit System Explained */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: "Poppins, sans-serif", color: "#14532d" }}>
                        🪙 The AgriCredit System — Explained
                    </h2>

                    <div className="card-solid p-8 mb-8">
                        <h3 className="text-xl font-bold mb-4" style={{ color: "#14532d" }}>How Credits Are Pegged to MSP</h3>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-5 font-mono text-sm" style={{ color: "#14532d" }}>
                            <div className="mb-2 font-bold">MSP Pegging Formula:</div>
                            <div>Wheat MSP (2024-25) = ₹2,275 per quintal</div>
                            <div>= ₹22.75 per kg</div>
                            <div className="mt-2 font-bold text-green-600">∴ 1 AgriCredit (AC) = ₹{AC_TO_INR}</div>
                            <div className="mt-3 text-gray-500">All commodity conversions use this base rate.</div>
                            <div className="text-gray-500">Government revises MSP annually → AC value updates accordingly.</div>
                        </div>

                        <h4 className="font-bold mb-3" style={{ color: "#14532d" }}>Sample Conversions:</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                { crop: "Wheat", kg: 100, msp: MSP_RATES.wheat },
                                { crop: "Onion", kg: 50, msp: MSP_RATES.onion },
                                { crop: "Groundnut", kg: 25, msp: MSP_RATES.groundnut },
                            ].map(({ crop, kg, msp }) => {
                                const inr = kg * (msp / 100);
                                const ac = Math.floor(inr / AC_TO_INR);
                                return (
                                    <div key={crop} className="bg-white border border-green-100 rounded-xl p-4 text-sm">
                                        <div className="font-bold mb-2" style={{ color: "#14532d" }}>{crop} ({kg}kg)</div>
                                        <div style={{ color: "#6b7280" }}>MSP: ₹{msp}/qtl</div>
                                        <div style={{ color: "#6b7280" }}>Value: ₹{inr.toLocaleString()}</div>
                                        <div className="mt-2 ac-badge inline-flex">=  {ac} AC</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Why MSP Pegging */}
                    <div className="card-solid p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4" style={{ color: "#14532d" }}>Why MSP Pegging?</h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {[
                                { icon: "🛡️", title: "Anti-Inflation", desc: "MSP pegging prevents arbitrary credit inflation. No one can simply 'print' more credits — value is always tied to real government-set crop values." },
                                { icon: "📌", title: "Familiar Reference", desc: "Farmers understand MSP. By tying credits to MSP, they intuitively understand credit value without needing financial literacy." },
                                { icon: "🔄", title: "Annual Adjustment", desc: "When government increases MSP (which happens almost every year), the AC value updates too — protecting long-term purchasing power." },
                                { icon: "⚖️", title: "Fair Exchange", desc: "Whether trading wheat, rice, or vegetables, the MSP peg ensures commodities are compared on fair, government-standard baselines." },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-3">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <div className="font-semibold mb-1" style={{ color: "#14532d" }}>{item.title}</div>
                                        <div style={{ color: "#4b7c5c" }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Escrow Mechanism */}
                    <div className="card-solid p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4" style={{ color: "#14532d" }}>🔐 Escrow Mechanism</h3>
                        <div className="flex flex-col md:flex-row gap-4 text-sm mb-4">
                            {[
                                { step: "1", title: "Buyer Bids", desc: "Buyer agrees on price. Their ACs are immediately locked in escrow — deducted from wallet but not yet given to seller." },
                                { step: "2", title: "Trade Active", desc: "Listing marked 'in escrow'. No other buyer can bid. Seller prepares delivery. Both parties have protection." },
                                { step: "3", title: "Delivery & Release", desc: "Buyer confirms they received the crop. System auto-deducts 1% fee, releases balance to seller instantly." },
                            ].map((item) => (
                                <div key={item.step} className="flex-1 p-4 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #dcfce7" }}>
                                    <div className="w-7 h-7 rounded-full mb-2 flex items-center justify-center text-sm font-bold text-white" style={{ background: "#16a34a" }}>
                                        {item.step}
                                    </div>
                                    <div className="font-semibold mb-1" style={{ color: "#14532d" }}>{item.title}</div>
                                    <div style={{ color: "#4b7c5c" }}>{item.desc}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm p-3 rounded-xl" style={{ background: "#fef3c7", color: "#92400e" }}>
                            ⚠️ Dispute resolution: If buyer does not confirm within 72 hours, a mediator from APMC is assigned. Credits held in escrow until resolution.
                        </div>
                    </div>

                    {/* Revenue Model */}
                    <div className="card-solid p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4" style={{ color: "#14532d" }}>💱 Revenue Model</h3>
                        <div className="text-lg font-mono mb-4 p-4 rounded-xl" style={{ background: "#f0fdf4", color: "#14532d" }}>
                            Platform Fee = {PLATFORM_FEE_PCT * 100}% of each trade
                            <br />
                            <br />
                            Example: Trade 2000 AC
                            <br />
                            Fee = 20 AC → Platform wallet
                            <br />
                            Seller receives = 1980 AC
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {[
                                { title: "Why 1%?", desc: "Fair enough to generate revenue, low enough that farmers don't feel it. Traditional mandi commission is 2-5% — we're always cheaper." },
                                { title: "Where does fee go?", desc: "Platform maintenance, APMC integration costs, dispute resolution team, server infrastructure, and feature development." },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-2">
                                    <CheckCircle2 size={16} style={{ color: "#16a34a", marginTop: 2, flexShrink: 0 }} />
                                    <div>
                                        <div className="font-semibold" style={{ color: "#14532d" }}>{item.title}</div>
                                        <div style={{ color: "#4b7c5c" }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Credit Rewards */}
                    <div className="card-solid p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4" style={{ color: "#14532d" }}>🎁 Credit Rewards — Feasibility Analysis</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ background: "#14532d", color: "white" }}>
                                        <th className="px-4 py-2 text-left rounded-l-lg">Action</th>
                                        <th className="px-4 py-2 text-center">Reward</th>
                                        <th className="px-4 py-2 text-center">INR Value</th>
                                        <th className="px-4 py-2 text-left rounded-r-lg">Rationale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { action: "List a crop", key: "listing_created", why: "Incentivizes supply-side participation" },
                                        { action: "Complete trade (seller)", key: "trade_completed_seller", why: "Loyalty bonus, encourages repeat trading" },
                                        { action: "First trade this month", key: "first_trade_this_month", why: "Monthly engagement driver" },
                                        { action: "Verify another farmer", key: "community_verification", why: "Pays for trust infrastructure" },
                                        { action: "Grade A produce", key: "quality_grade_a", why: "Quality improvement incentive" },
                                        { action: "Refer new farmer", key: "referral_new_farmer", why: "Viral growth at low CAC" },
                                    ].map((row, i) => {
                                        const ac = CREDIT_REWARDS[row.key as keyof typeof CREDIT_REWARDS];
                                        return (
                                            <tr key={row.key} style={{ background: i % 2 === 0 ? "white" : "#f0fdf4" }}>
                                                <td className="px-4 py-2 font-medium" style={{ color: "#14532d" }}>{row.action}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className="ac-badge text-xs">+{ac} AC</span>
                                                </td>
                                                <td className="px-4 py-2 text-center" style={{ color: "#16a34a", fontWeight: "bold" }}>
                                                    ≈ ₹{(ac * AC_TO_INR).toFixed(0)}
                                                </td>
                                                <td className="px-4 py-2 text-xs" style={{ color: "#4b7c5c" }}>{row.why}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-sm p-3 rounded-xl" style={{ background: "#dcfce7", color: "#16a34a" }}>
                            ✅ These rewards are funded from the 1% platform fee. At 2000 trades/day × avg 500 AC = 100,000 AC/day in fees. Reward pool is sustainable.
                        </div>
                    </div>

                    {/* Anti-Hoarding */}
                    <div className="card-solid p-6">
                        <h3 className="text-xl font-bold mb-4" style={{ color: "#14532d" }}>⏱️ Credit Expiry & Anti-Hoarding</h3>
                        <div className="text-sm space-y-3" style={{ color: "#4b7c5c" }}>
                            <p><strong style={{ color: "#14532d" }}>Problem:</strong> If farmers hoard millions of ACs without trading, the credit economy freezes. Supply of goods but no demand (because everyone is holding).</p>
                            <p><strong style={{ color: "#14532d" }}>Solution:</strong> Credits inactive for 12 months start decaying at 2% per month.</p>
                            <div className="bg-white border border-green-100 rounded-lg p-4 font-mono text-xs">
                                <div>Months Inactive: 13 months</div>
                                <div>Starting Balance: 10,000 AC</div>
                                <div>Decay Months: 13 - 11 = 2 months</div>
                                <div>New Balance: 10,000 × (0.98)^2 = 9,604 AC</div>
                                <div>Loss: 396 AC</div>
                            </div>
                            <p><strong style={{ color: "#14532d" }}>Effect:</strong> Keeps money circulating. Farmers are incentivized to trade regularly, keeping market liquid and active.</p>
                        </div>
                    </div>
                </div>

                {/* Government Backing */}
                <div className="text-center py-10">
                    <div className="text-4xl mb-4">🏛️</div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: "#14532d" }}>
                        Government of India Initiative
                    </h2>
                    <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: "#4b7c5c" }}>
                        eNAM is implemented by the <strong>Small Farmers Agribusiness Consortium (SFAC)</strong> under the aegis of the <strong>Ministry of Agriculture and Farmers&apos; Welfare</strong>, Government of India.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        {["1522 Mandis", "23 States & UTs", "190+ Commodities", "₹2.4L Cr+ Trade"].map((stat) => (
                            <div
                                key={stat}
                                className="px-4 py-2 rounded-full font-semibold"
                                style={{ background: "#dcfce7", color: "#16a34a" }}
                            >
                                ✅ {stat}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Link href="/register" className="btn-primary text-lg px-8 py-4 mr-4">
                            Join eNAM — It&apos;s Free
                        </Link>
                        <Link href="/marketplace" className="btn-secondary text-lg px-8 py-4">
                            Browse Marketplace
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
