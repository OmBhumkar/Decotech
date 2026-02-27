"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    Menu, X, Leaf, ChevronDown, LogOut, User,
    Wallet, BarChart2, ShoppingBag, TrendingUp, Info,
    Coins
} from "lucide-react";

const NAV_LINKS = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/prices", label: "Prices" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
];

const DROP_LINKS = [
    { href: "/dashboard", icon: BarChart2, label: "Dashboard" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/my-listings", icon: ShoppingBag, label: "My Listings" },
    { href: "/profile", icon: User, label: "Profile" },
];

export default function Navbar() {
    const { user, profile, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--border)",
                height: "64px",
            }}
        >
            <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

                {/* ── Logo ── */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <div style={{
                        width: 36, height: 36,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, var(--green-700), var(--green-500))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <Leaf size={18} color="white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", lineHeight: 1.1 }}>
                            AgriTrade <span style={{ color: "var(--green-600)" }}>Platform</span>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>National Agriculture Market</div>
                    </div>
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 500,
                                color: "var(--text-secondary)",
                                transition: "background 0.15s ease, color 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "var(--bg-muted)";
                                (e.currentTarget as HTMLElement).style.color = "var(--green-700)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                            }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* ── Right Side ── */}
                <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {user && profile ? (
                        <>
                            {/* AC Balance */}
                            <div className="ac-pill" style={{ fontSize: 12 }}>
                                <Coins size={13} />
                                {profile.agriCredits.toLocaleString()} AC
                            </div>

                            {/* Avatar + Dropdown */}
                            <div style={{ position: "relative" }}>
                                <button
                                    id="user-avatar-btn"
                                    onClick={() => setDropOpen(!dropOpen)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "6px 12px", borderRadius: 10,
                                        background: dropOpen ? "var(--bg-muted)" : "transparent",
                                        border: "1.5px solid var(--border)",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-muted)")}
                                    onMouseLeave={(e) => {
                                        if (!dropOpen) e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    <div style={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--green-600), var(--green-400))",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <User size={14} color="white" />
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                                        {profile.name?.split(" ")[0] || profile.phone?.slice(-4).padStart(6, "•")}
                                    </span>
                                    <ChevronDown size={14} color="var(--text-muted)" style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                                </button>

                                {dropOpen && (
                                    <div
                                        className="anim-scaleIn"
                                        style={{
                                            position: "absolute", top: "calc(100% + 8px)", right: 0,
                                            width: 210, background: "white",
                                            border: "1px solid var(--border)", borderRadius: 14,
                                            boxShadow: "var(--shadow-xl)", padding: "6px",
                                            zIndex: 200,
                                        }}
                                    >
                                        {DROP_LINKS.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setDropOpen(false)}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: 10,
                                                    padding: "9px 12px", borderRadius: 10,
                                                    fontSize: 13, fontWeight: 500,
                                                    color: "var(--text-secondary)", transition: "background 0.12s",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-muted)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                            >
                                                <item.icon size={15} />
                                                {item.label}
                                            </Link>
                                        ))}
                                        <div style={{ height: 1, background: "var(--border)", margin: "4px 8px" }} />
                                        <button
                                            onClick={() => { logout(); setDropOpen(false); }}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 10,
                                                padding: "9px 12px", borderRadius: 10, width: "100%",
                                                fontSize: 13, fontWeight: 500, color: "#ef4444",
                                                background: "transparent", border: "none", cursor: "pointer",
                                                transition: "background 0.12s",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f1")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <LogOut size={15} />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                            <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
                        </>
                    )}
                </div>

                {/* ── Mobile Hamburger ── */}
                <button
                    className="hide-desktop"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        padding: 8, borderRadius: 8, background: "transparent",
                        border: "1.5px solid var(--border)", color: "var(--text-secondary)",
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* ── Mobile Menu ── */}
            {menuOpen && (
                <div
                    className="anim-fadeIn hide-desktop"
                    style={{
                        position: "absolute", top: 64, left: 0, right: 0,
                        background: "white", borderBottom: "1px solid var(--border)",
                        padding: "16px",
                        boxShadow: "var(--shadow-lg)",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    padding: "11px 16px", borderRadius: 10,
                                    fontSize: 15, fontWeight: 500, color: "var(--text-secondary)",
                                    background: "var(--bg-muted)", display: "block",
                                }}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
                        {user ? (
                            <>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--bg-muted)", borderRadius: 10 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                                        {profile?.name || "Farmer"}
                                    </span>
                                    <div className="ac-pill" style={{ fontSize: 12 }}>
                                        <Coins size={12} />
                                        {profile?.agriCredits?.toLocaleString()} AC
                                    </div>
                                </div>
                                <button
                                    onClick={() => { logout(); setMenuOpen(false); }}
                                    style={{
                                        padding: "11px 16px", borderRadius: 10, width: "100%", textAlign: "left",
                                        fontSize: 14, fontWeight: 500, color: "#ef4444",
                                        background: "#fff1f1", border: "none", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: 8,
                                    }}
                                >
                                    <LogOut size={15} /> Sign out
                                </button>
                            </>
                        ) : (
                            <div style={{ display: "flex", gap: 10 }}>
                                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }}>Sign in</Link>
                                <Link href="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
