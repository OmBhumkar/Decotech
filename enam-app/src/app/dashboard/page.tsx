"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Wallet, TrendingUp, Package, ShoppingCart, Shield, BarChart3,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle,
    Wheat, MapPin, Users, Star
} from "lucide-react";
import { AC_TO_INR, CREDIT_REWARDS } from "@/lib/agriCredit";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DEMO_TRANSACTIONS = [
    { id: "t1", type: "earned", description: "Trade completed (Wheat 200kg)", amount: 10, date: new Date(Date.now() - 2 * 86400000), status: "completed" },
    { id: "t2", type: "earned", description: "Listing posted (Rice)", amount: 5, date: new Date(Date.now() - 3 * 86400000), status: "completed" },
    { id: "t3", type: "spent", description: "Purchased Tomato (100kg)", amount: 28, date: new Date(Date.now() - 5 * 86400000), status: "completed" },
    { id: "t4", type: "earned", description: "Community verification bonus", amount: 15, date: new Date(Date.now() - 7 * 86400000), status: "completed" },
    { id: "t5", type: "earned", description: "Welcome bonus on registration", amount: 50, date: new Date(Date.now() - 30 * 86400000), status: "completed" },
    { id: "t6", type: "escrow", description: "Mustard purchase (escrow lock)", amount: 400, date: new Date(Date.now() - 1 * 86400000), status: "pending" },
];

const SUPPLY_DEMAND_DATA = [
    { name: "Wheat", surplus: 85, demand: 72 },
    { name: "Rice", surplus: 60, demand: 78 },
    { name: "Tomato", surplus: 42, demand: 90 },
    { name: "Onion", surplus: 110, demand: 65 },
    { name: "Mustard", surplus: 38, demand: 55 },
    { name: "Maize", surplus: 70, demand: 80 },
];

const PIE_DATA = [
    { name: "Food Grains", value: 45, color: "#16a34a" },
    { name: "Vegetables", value: 28, color: "#059669" },
    { name: "Oilseeds", value: 18, color: "#0284c7" },
    { name: "Pulses", value: 6, color: "#7c3aed" },
    { name: "Cash Crops", value: 3, color: "#d97706" },
];

export default function DashboardPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("overview");

    // Demo profile when not logged in
    const displayProfile = profile || {
        name: "Kisan Kumar (Demo)",
        phone: "+91 98765*****",
        village: "Amritsar",
        state: "Punjab",
        agriCredits: 2840,
        trustScore: 87,
        totalTrades: 14,
        verified: true,
        role: "farmer",
    };

    const inrValue = displayProfile.agriCredits * AC_TO_INR;
    const escrowedAC = 400;
    const availableAC = displayProfile.agriCredits - escrowedAC;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0fdf4" }}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "#dcfce7", borderTopColor: "#16a34a" }} />
                    <p style={{ color: "#16a34a" }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "#f0fdf4" }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }} className="py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                                Jai Kisan! 🌾
                            </h1>
                            <p className="text-green-200">{displayProfile.name} • {displayProfile.village}, {displayProfile.state}</p>
                            {!user && (
                                <div className="mt-2 px-3 py-1 rounded-full text-xs font-medium inline-block" style={{ background: "rgba(245,158,11,0.3)", color: "#fef3c7" }}>
                                    👁️ Demo Mode — Login for full access
                                </div>
                            )}
                        </div>

                        {/* Wallet Card */}
                        <div
                            className="rounded-2xl p-5 w-full md:w-auto md:min-w-72"
                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)" }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet size={18} className="text-white" />
                                <span className="text-green-200 text-sm font-medium">AgriCredit Wallet</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{displayProfile.agriCredits.toLocaleString()} AC</div>
                            <div className="text-green-300 text-sm">≈ ₹{inrValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                            <div className="mt-3 text-xs text-green-300 flex items-center gap-1">
                                <Shield size={12} /> {escrowedAC} AC in escrow
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                            { label: "Available AC", value: `${availableAC.toLocaleString()} AC`, icon: "💰", color: "#4ade80" },
                            { label: "Trust Score", value: `${displayProfile.trustScore}/100 ⭐`, icon: "🛡️", color: "#93c5fd" },
                            { label: "Total Trades", value: displayProfile.totalTrades.toString(), icon: "🤝", color: "#fde68a" },
                            { label: "Role", value: String(displayProfile.role).charAt(0).toUpperCase() + String(displayProfile.role).slice(1), icon: "👨‍🌾", color: "#c4b5fd" },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                                <div className="text-2xl mb-1">{s.icon}</div>
                                <div className="font-bold text-white">{s.value}</div>
                                <div className="text-xs text-green-300">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Section Nav */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { key: "overview", label: "📊 Overview" },
                        { key: "wallet", label: "💰 Wallet" },
                        { key: "analytics", label: "📈 Market Analytics" },
                        { key: "rewards", label: "🎁 Earn Rewards" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveSection(tab.key)}
                            className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: activeSection === tab.key ? "#16a34a" : "white",
                                color: activeSection === tab.key ? "white" : "#166534",
                                border: "1px solid",
                                borderColor: activeSection === tab.key ? "#16a34a" : "#dcfce7",
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeSection === "overview" && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <h2 className="text-lg font-bold mb-3" style={{ color: "#14532d" }}>Quick Actions</h2>
                            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                {[
                                    { href: "/marketplace", icon: "🛒", title: "Browse Marketplace", desc: "Buy crops from nearby farmers", color: "#16a34a" },
                                    { href: "/marketplace", icon: "📤", title: "Post Surplus", desc: "List your crop and earn AC", color: "#059669" },
                                    { href: "/marketplace", icon: "💬", title: "Active Chats", desc: "2 pending trade conversations", color: "#0284c7" },
                                    { href: "/prices", icon: "📊", title: "Live MSP Prices", desc: "Check today's commodity rates", color: "#7c3aed" },
                                ].map((action) => (
                                    <Link key={action.href + action.title} href={action.href} className="card-solid p-4 flex gap-3 items-start">
                                        <div className="text-3xl">{action.icon}</div>
                                        <div>
                                            <div className="font-semibold" style={{ color: "#14532d" }}>{action.title}</div>
                                            <div className="text-sm" style={{ color: "#4b7c5c" }}>{action.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Recent Transactions */}
                            <h2 className="text-lg font-bold mb-3" style={{ color: "#14532d" }}>Recent Transactions</h2>
                            <div className="card-solid overflow-hidden">
                                {DEMO_TRANSACTIONS.slice(0, 5).map((txn, i) => (
                                    <div
                                        key={txn.id}
                                        className="flex items-center justify-between px-4 py-3 text-sm"
                                        style={{ borderBottom: i < 4 ? "1px solid #f0fdf4" : "none" }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: txn.type === "earned" ? "#dcfce7" : txn.type === "escrow" ? "#fef3c7" : "#fef2f2",
                                                }}
                                            >
                                                {txn.type === "earned" ? <ArrowDownRight size={16} style={{ color: "#16a34a" }} /> :
                                                    txn.type === "escrow" ? <Clock size={16} style={{ color: "#92400e" }} /> :
                                                        <ArrowUpRight size={16} style={{ color: "#dc2626" }} />}
                                            </div>
                                            <div>
                                                <div style={{ color: "#14532d" }} className="font-medium">{txn.description}</div>
                                                <div style={{ color: "#9ca3af" }} className="text-xs">{txn.date.toLocaleDateString("en-IN")}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className="font-bold"
                                                style={{ color: txn.type === "earned" ? "#16a34a" : txn.type === "escrow" ? "#92400e" : "#dc2626" }}
                                            >
                                                {txn.type === "earned" ? "+" : txn.type === "spent" ? "-" : "🔐"} {txn.amount} AC
                                            </div>
                                            <div className="text-xs" style={{ color: txn.status === "completed" ? "#16a34a" : "#f59e0b" }}>
                                                {txn.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Credit System Info */}
                            <div className="card-solid p-5">
                                <h3 className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: "#14532d" }}>
                                    🪙 Your Credit Health
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Total Balance</span>
                                        <span className="font-bold" style={{ color: "#16a34a" }}>{displayProfile.agriCredits} AC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>In Escrow</span>
                                        <span style={{ color: "#92400e" }}>🔐 {escrowedAC} AC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Available</span>
                                        <span className="font-bold" style={{ color: "#14532d" }}>{availableAC} AC</span>
                                    </div>
                                    <hr style={{ borderColor: "#f0fdf4" }} />
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>INR Value</span>
                                        <span className="font-bold">₹{inrValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>AC Rate</span>
                                        <span>₹{AC_TO_INR}/AC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Decay Risk</span>
                                        <span style={{ color: "#16a34a" }}>✅ None (active)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className="card-solid p-5">
                                <h3 className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: "#14532d" }}>
                                    🛡️ Verification Status
                                </h3>
                                {displayProfile.verified ? (
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle2 size={20} />
                                        <span className="font-medium">Community Verified</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2" style={{ color: "#92400e" }}>
                                        <AlertCircle size={20} />
                                        <span>Verification pending</span>
                                    </div>
                                )}
                                <div className="mt-3 text-sm" style={{ color: "#4b7c5c" }}>
                                    Trust Score: <strong>{displayProfile.trustScore}/100</strong>
                                    <div className="mt-2 h-2 rounded-full" style={{ background: "#dcfce7" }}>
                                        <div
                                            className="h-2 rounded-full"
                                            style={{ background: "linear-gradient(90deg, #16a34a, #059669)", width: `${displayProfile.trustScore}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Not logged in CTA */}
                            {!user && (
                                <div
                                    className="p-5 rounded-xl text-center"
                                    style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}
                                >
                                    <div className="text-3xl mb-2">🌾</div>
                                    <div className="text-white font-bold mb-2">Login to activate wallet</div>
                                    <p className="text-green-200 text-sm mb-3">Get 50 AC free on signup</p>
                                    <Link href="/login" className="btn-gold text-sm py-2 px-4">Login with OTP</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === "analytics" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold" style={{ color: "#14532d" }}>📊 Supply–Demand Intelligence Dashboard</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="card-solid p-5">
                                <h3 className="font-semibold mb-4" style={{ color: "#14532d" }}>Crop Surplus vs Demand (Listings)</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={SUPPLY_DEMAND_DATA}>
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#166534" }} />
                                        <YAxis tick={{ fontSize: 12, fill: "#166534" }} />
                                        <Tooltip
                                            contentStyle={{ background: "white", border: "1px solid #dcfce7", borderRadius: "8px" }}
                                        />
                                        <Bar dataKey="surplus" fill="#16a34a" name="Surplus Listings" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="demand" fill="#059669" name="Demand Queries" radius={[4, 4, 0, 0]} opacity={0.7} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="card-solid p-5">
                                <h3 className="font-semibold mb-4" style={{ color: "#14532d" }}>Category Distribution</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                                            {PIE_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { label: "Most Surplus", crop: "🧅 Onion", village: "Solapur", qty: "2,400kg", trend: "High surplus in Maharashtra" },
                                { label: "Highest Demand", crop: "🍅 Tomato", village: "Nashik", qty: "1,800kg needed", trend: "Deficit in North India" },
                                { label: "Best Price Today", crop: "🥜 Groundnut", village: "Rajkot", qty: "₹67.83/kg", trend: "5.2% above MSP" },
                            ].map((item) => (
                                <div key={item.label} className="card-solid p-4">
                                    <div className="text-xs font-semibold uppercase mb-2" style={{ color: "#9ca3af" }}>{item.label}</div>
                                    <div className="text-2xl mb-1">{item.crop}</div>
                                    <div className="text-sm font-medium" style={{ color: "#14532d" }}>{item.qty}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <MapPin size={12} style={{ color: "#6b7280" }} />
                                        <span className="text-xs" style={{ color: "#6b7280" }}>{item.village}</span>
                                    </div>
                                    <div className="text-xs mt-2 px-2 py-0.5 rounded-full inline-block" style={{ background: "#dcfce7", color: "#16a34a" }}>
                                        {item.trend}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === "rewards" && (
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-bold mb-6" style={{ color: "#14532d" }}>🎁 Earn AgriCredits</h2>
                        <div className="space-y-4">
                            {Object.entries(CREDIT_REWARDS).map(([key, amount]) => {
                                const labels: Record<string, { label: string; desc: string; icon: string; done: boolean }> = {
                                    listing_created: { label: "Post a Crop Listing", desc: "Upload crop image and details", icon: "📤", done: true },
                                    trade_completed_seller: { label: "Complete a Trade (Seller)", desc: "Deliver crop and receive payment", icon: "✅", done: false },
                                    first_trade_this_month: { label: "First Trade This Month", desc: "Complete first trade in 30 days", icon: "⚡", done: false },
                                    community_verification: { label: "Verify Another Farmer", desc: "Endorse a nearby farmer's listing", icon: "🛡️", done: false },
                                    quality_grade_a: { label: "List Grade A Produce", desc: "Get quality certification", icon: "🏆", done: false },
                                    referral_new_farmer: { label: "Refer a New Farmer", desc: "Invite someone and they join", icon: "👥", done: false },
                                };
                                const info = labels[key];
                                if (!info) return null;
                                return (
                                    <div key={key} className="card-solid p-4 flex items-center gap-4">
                                        <div className="text-3xl">{info.icon}</div>
                                        <div className="flex-1">
                                            <div className="font-semibold" style={{ color: "#14532d" }}>{info.label}</div>
                                            <div className="text-sm" style={{ color: "#4b7c5c" }}>{info.desc}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="ac-badge">+{amount} AC</div>
                                            {info.done ? (
                                                <span className="text-xs" style={{ color: "#16a34a" }}>✅ Done</span>
                                            ) : (
                                                <span className="text-xs" style={{ color: "#9ca3af" }}>Not done</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeSection === "wallet" && (
                    <div className="max-w-xl">
                        <h2 className="text-xl font-bold mb-6" style={{ color: "#14532d" }}>💰 AgriCredit Wallet</h2>

                        {/* Wallet Card */}
                        <div
                            className="rounded-2xl p-6 mb-6"
                            style={{ background: "linear-gradient(135deg, #14532d, #059669)", boxShadow: "0 10px 40px rgba(22,163,74,0.3)" }}
                        >
                            <div className="text-green-300 text-sm mb-1">Available Balance</div>
                            <div className="text-4xl font-bold text-white mb-1">{availableAC.toLocaleString()} AC</div>
                            <div className="text-green-300 text-sm mb-4">≈ ₹{(availableAC * AC_TO_INR).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                            <div className="flex justify-between text-sm">
                                <span className="text-green-300">🔐 In Escrow: {escrowedAC} AC</span>
                                <span className="text-green-300">Total: {displayProfile.agriCredits} AC</span>
                            </div>
                        </div>

                        {/* All Transactions */}
                        <div className="card-solid overflow-hidden">
                            <div className="px-4 py-3" style={{ borderBottom: "1px solid #f0fdf4", background: "#f9fafb" }}>
                                <h3 className="font-semibold text-sm" style={{ color: "#14532d" }}>Transaction History</h3>
                            </div>
                            {DEMO_TRANSACTIONS.map((txn, i) => (
                                <div
                                    key={txn.id}
                                    className="flex items-center justify-between px-4 py-3.5 text-sm"
                                    style={{ borderBottom: i < DEMO_TRANSACTIONS.length - 1 ? "1px solid #f0fdf4" : "none" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center"
                                            style={{
                                                background: txn.type === "earned" ? "#dcfce7" : txn.type === "escrow" ? "#fef3c7" : "#fef2f2",
                                            }}
                                        >
                                            {txn.type === "earned" ? <ArrowDownRight size={16} style={{ color: "#16a34a" }} /> :
                                                txn.type === "escrow" ? <Clock size={16} style={{ color: "#92400e" }} /> :
                                                    <ArrowUpRight size={16} style={{ color: "#dc2626" }} />}
                                        </div>
                                        <div>
                                            <div style={{ color: "#14532d" }} className="font-medium">{txn.description}</div>
                                            <div style={{ color: "#9ca3af" }} className="text-xs">{txn.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className="font-bold"
                                            style={{ color: txn.type === "earned" ? "#16a34a" : txn.type === "escrow" ? "#92400e" : "#dc2626" }}
                                        >
                                            {txn.type === "earned" ? "+" : txn.type === "spent" ? "-" : "🔐"} {txn.amount} AC
                                        </div>
                                        <div
                                            className="text-xs px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
                                            style={{
                                                background: txn.status === "completed" ? "#dcfce7" : "#fef3c7",
                                                color: txn.status === "completed" ? "#16a34a" : "#92400e",
                                            }}
                                        >
                                            {txn.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
