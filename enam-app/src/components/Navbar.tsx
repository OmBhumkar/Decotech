"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Wheat, ChevronDown, LogOut, User, Wallet, BarChart3, ShoppingBag } from "lucide-react";

export default function Navbar() {
    const { user, profile, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);

    return (
        <nav
            className="sticky top-0 z-50 w-full"
            style={{
                background: "rgba(240, 253, 244, 0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid #dcfce7",
                boxShadow: "0 2px 16px rgba(22, 163, 74, 0.08)",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                    <Image src="/logo.png" alt="eNAM Logo" width={40} height={40} className="rounded-lg" />
                    <div>
                        <div className="font-bold text-lg leading-tight" style={{ color: "#14532d" }}>
                            eNAM
                            <span className="text-green-600 ml-1">AgriMarket</span>
                        </div>
                        <div className="text-xs text-green-600 leading-none">National Agriculture Market</div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {[
                        { href: "/marketplace", label: "Marketplace" },
                        { href: "/prices", label: "Prices" },
                        { href: "/dashboard", label: "Dashboard" },
                        { href: "/about", label: "About eNAM" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ color: "#166534" }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.background = "#dcfce7";
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.background = "transparent";
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="hidden md:flex items-center gap-3">
                    {user && profile ? (
                        <div className="relative flex items-center gap-3">
                            {/* AgriCredit Balance */}
                            <div className="ac-badge">
                                <Wheat size={14} />
                                {profile.agriCredits.toLocaleString()} AC
                            </div>

                            {/* User Menu */}
                            <button
                                id="user-menu-btn"
                                onClick={() => setDropOpen(!dropOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: "#dcfce7", color: "#14532d" }}
                            >
                                <User size={16} />
                                <span className="text-sm font-medium">
                                    {profile.name || profile.phone?.slice(-4).padStart(8, "•")}
                                </span>
                                <ChevronDown size={14} />
                            </button>

                            {dropOpen && (
                                <div
                                    className="absolute right-0 top-12 w-52 rounded-xl py-2 z-50"
                                    style={{
                                        background: "white",
                                        border: "1px solid #dcfce7",
                                        boxShadow: "0 10px 32px rgba(22, 163, 74, 0.15)",
                                    }}
                                >
                                    {[
                                        { href: "/dashboard", icon: <BarChart3 size={15} />, label: "Dashboard" },
                                        { href: "/wallet", icon: <Wallet size={15} />, label: "My Wallet" },
                                        { href: "/my-listings", icon: <ShoppingBag size={15} />, label: "My Listings" },
                                        { href: "/profile", icon: <User size={15} />, label: "Profile" },
                                    ].map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                                            style={{ color: "#166534" }}
                                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f0fdf4")}
                                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                                            onClick={() => setDropOpen(false)}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    ))}
                                    <hr style={{ borderColor: "#dcfce7", margin: "0.5rem 0" }} />
                                    <button
                                        onClick={() => { logout(); setDropOpen(false); }}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors"
                                        style={{ color: "#dc2626" }}
                                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#fef2f2")}
                                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                                    >
                                        <LogOut size={15} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                            <Link href="/register" className="btn-primary text-sm py-2 px-4">Register Free</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden p-2 rounded-lg"
                    style={{ color: "#16a34a" }}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div
                    className="md:hidden px-4 py-4 space-y-2"
                    style={{ borderTop: "1px solid #dcfce7", background: "rgba(240, 253, 244, 0.98)" }}
                >
                    {[
                        { href: "/marketplace", label: "🛒 Marketplace" },
                        { href: "/prices", label: "📊 Live Prices" },
                        { href: "/dashboard", label: "📈 Dashboard" },
                        { href: "/about", label: "ℹ️ About eNAM" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 rounded-lg font-medium text-sm"
                            style={{ color: "#166534", background: "#f0fdf4" }}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            <Link href="/dashboard" className="block px-4 py-3 rounded-lg text-sm font-medium" style={{ color: "#166534", background: "#dcfce7" }} onClick={() => setMenuOpen(false)}>
                                💰 {profile?.agriCredits.toLocaleString()} AgriCredits
                            </Link>
                            <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium" style={{ color: "#dc2626", background: "#fef2f2" }}>
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2 pt-2">
                            <Link href="/login" className="btn-secondary flex-1 text-center py-3 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link href="/register" className="btn-primary flex-1 text-center py-3 text-sm" onClick={() => setMenuOpen(false)}>Register</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
