"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getListings, Listing } from "@/lib/marketplace";
import { commodityToAC, AC_TO_INR } from "@/lib/agriCredit";
import {
    Search, Plus, MapPin, Clock, CheckCircle, Upload, TrendingUp,
    ArrowRight, MessageCircle, Package, Filter, ShieldCheck, Wheat,
    Layers, BarChart2, Coins, SlidersHorizontal, X
} from "lucide-react";
import toast from "react-hot-toast";

/* ── Demo data ── */
const DEMO: Listing[] = [
    {
        id: "d1", farmerId: "u1", farmerName: "Ramesh Kumar", farmerPhone: "+91 98765*****",
        commodity: "Wheat", category: "Food Grains", quantityKg: 200, qualityGrade: "A",
        askingPriceAC: 220, mspValueAC: 200, imageUrl: "",
        village: "Amritsar", state: "Punjab",
        lat: 31.63, lng: 74.87,
        description: "Sharbati wheat, dried and cleaned. Grade A. Suitable for atta mills.",
        verificationCount: 2, verified: true, status: "active",
        createdAt: new Date(Date.now() - 2 * 3600000), expiresAt: new Date(Date.now() + 28 * 86400000),
    },
    {
        id: "d2", farmerId: "u2", farmerName: "Sukhbir Yadav", farmerPhone: "+91 87654*****",
        commodity: "Rice", category: "Food Grains", quantityKg: 500, qualityGrade: "B",
        askingPriceAC: 510, mspValueAC: 500, imageUrl: "",
        village: "Gorakhpur", state: "Uttar Pradesh",
        lat: 26.76, lng: 83.37,
        description: "Basmati variety, 2024 harvest. Excellent aroma. FPO certified.",
        verificationCount: 1, verified: false, status: "active",
        createdAt: new Date(Date.now() - 5 * 3600000), expiresAt: new Date(Date.now() + 25 * 86400000),
    },
    {
        id: "d3", farmerId: "u3", farmerName: "Priya Devi", farmerPhone: "+91 76543*****",
        commodity: "Tomato", category: "Vegetables", quantityKg: 100, qualityGrade: "A",
        askingPriceAC: 28, mspValueAC: 26, imageUrl: "",
        village: "Nashik", state: "Maharashtra",
        lat: 19.99, lng: 73.79,
        description: "Hybrid tomatoes, fresh picked today. Urgent sale. 6–8cm grade.",
        verificationCount: 3, verified: true, status: "active",
        createdAt: new Date(Date.now() - 1 * 3600000), expiresAt: new Date(Date.now() + 7 * 86400000),
    },
    {
        id: "d4", farmerId: "u4", farmerName: "Mehul Patel", farmerPhone: "+91 65432*****",
        commodity: "Groundnut", category: "Oilseeds", quantityKg: 300, qualityGrade: "A",
        askingPriceAC: 905, mspValueAC: 890, imageUrl: "",
        village: "Rajkot", state: "Gujarat",
        lat: 22.30, lng: 70.80,
        description: "Bold variety groundnut, oil content 48%+. FPO aggregated batch.",
        verificationCount: 2, verified: true, status: "active",
        createdAt: new Date(Date.now() - 8 * 3600000), expiresAt: new Date(Date.now() + 22 * 86400000),
    },
    {
        id: "d5", farmerId: "u5", farmerName: "Leela Bai", farmerPhone: "+91 54321*****",
        commodity: "Onion", category: "Vegetables", quantityKg: 800, qualityGrade: "B",
        askingPriceAC: 285, mspValueAC: 280, imageUrl: "",
        village: "Solapur", state: "Maharashtra",
        lat: 17.68, lng: 75.91,
        description: "Red onion, post-monsoon. 6–8cm size. Well dried outer skin.",
        verificationCount: 2, verified: true, status: "active",
        createdAt: new Date(Date.now() - 12 * 3600000), expiresAt: new Date(Date.now() + 18 * 86400000),
    },
    {
        id: "d6", farmerId: "u6", farmerName: "Arjun Das", farmerPhone: "+91 98123*****",
        commodity: "Mustard", category: "Oilseeds", quantityKg: 150, qualityGrade: "A",
        askingPriceAC: 400, mspValueAC: 391, imageUrl: "",
        village: "Bharatpur", state: "Rajasthan",
        lat: 27.21, lng: 77.49,
        description: "Yellow mustard, high erucic acid content. 2024 rabi harvest.",
        verificationCount: 1, verified: false, status: "active",
        createdAt: new Date(Date.now() - 3 * 3600000), expiresAt: new Date(Date.now() + 27 * 86400000),
    },
];

function age(d: Date) {
    const h = Math.floor((Date.now() - d.getTime()) / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

/* ── Listing Card ── */
function ListingCard({ l }: { l: Listing }) {
    const inr = l.askingPriceAC * AC_TO_INR;
    const pKg = inr / l.quantityKg;

    return (
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            {/* top band */}
            <div style={{ padding: "18px 20px 14px", background: "linear-gradient(135deg, var(--green-50), var(--bg-muted))", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Wheat size={16} color="var(--green-600)" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>{l.commodity}</div>
                                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{l.category}</div>
                            </div>
                        </div>
                        <span className={`badge ${l.qualityGrade === "A" ? "badge-green" : "badge-amber"}`} style={{ fontSize: 11 }}>
                            Grade {l.qualityGrade}
                        </span>
                    </div>
                    {l.verified
                        ? <span className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}><CheckCircle size={11} /> Verified</span>
                        : <span className="badge badge-amber" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}><Clock size={11} /> {l.verificationCount}/2 Verified</span>
                    }
                </div>
            </div>

            {/* body */}
            <div style={{ padding: "16px 20px 20px" }}>
                {/* Price */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
                    <div>
                        <div className="ac-pill" style={{ fontSize: 12, marginBottom: 5 }}><Coins size={12} />{l.askingPriceAC.toLocaleString()} AC</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>≈ ₹{inr.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{l.quantityKg.toLocaleString()} kg</div>
                        <div style={{ fontSize: 12, color: "var(--text-faint)" }}>₹{pKg.toFixed(1)}/kg</div>
                    </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {l.description}
                </p>

                {/* Meta row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)" }}>
                        <MapPin size={13} />
                        {l.village}, {l.state}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-faint)" }}>
                        <Clock size={12} />
                        {age(l.createdAt)}
                    </div>
                </div>

                {/* Farmer */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, var(--green-500), var(--green-700))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>{l.farmerName[0]}</span>
                    </div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{l.farmerName}</div>
                        <div style={{ fontSize: 11, color: "var(--text-faint)" }}>MSP ref: {l.mspValueAC} AC</div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/trade/${l.id}`} className="btn btn-primary" style={{ flex: 1, fontSize: 13, padding: "10px 16px" }}>
                        Buy Now <ArrowRight size={14} />
                    </Link>
                    <Link href={`/chat/${l.id}`} className="btn btn-outline" style={{ padding: "10px 14px", fontSize: 13 }} title="Chat with farmer">
                        <MessageCircle size={15} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ── Post Surplus Modal ── */
function PostModal({ onClose }: { onClose: () => void }) {
    const { user, profile } = useAuth();
    const [form, setForm] = useState({ commodity: "wheat", quantityKg: 100, qualityGrade: "A", description: "", village: profile?.village || "", state: profile?.state || "" });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const acVal = commodityToAC(form.commodity, form.quantityKg);

    const CROPS = ["wheat", "rice", "maize", "soybean", "mustard", "groundnut", "cotton", "sugarcane", "onion", "tomato", "potato", "lentil", "chickpea", "barley", "jowar", "bajra"];
    const STATES = ["Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) { toast.error("Please login first"); return; }
        if (!preview) { toast.error("Crop image required for verification"); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        toast.success("Listing posted! +5 AgriCredits added.");
        onClose();
        setLoading(false);
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ width: "100%", maxWidth: 540, background: "white", borderRadius: 24, overflow: "hidden", maxHeight: "92vh", overflowY: "auto", boxShadow: "var(--shadow-xl)" }}>
                {/* Header */}
                <div style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                    <div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Post Surplus Crop</h2>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Earn +5 AgriCredits when listed</p>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: 8, borderRadius: 10 }}><X size={18} /></button>
                </div>

                <form onSubmit={submit} style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Image */}
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                            Crop Photo <span style={{ color: "#ef4444" }}>*</span>
                            <span style={{ fontWeight: 400, color: "var(--text-faint)", marginLeft: 6 }}>(required for verification)</span>
                        </label>
                        <label style={{
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            height: 140, borderRadius: 14, cursor: "pointer",
                            border: preview ? "2px solid var(--green-400)" : "2px dashed var(--border)",
                            background: preview ? "transparent" : "var(--bg-muted)",
                            overflow: "hidden", transition: "all 0.2s",
                        }}>
                            {preview
                                ? <img src={preview} alt="crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-100)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                                        <Upload size={20} color="var(--green-600)" />
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-600)" }}>Click to upload photo</div>
                                    <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>JPG, PNG · max 5 MB</div>
                                </>
                            }
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) { const r = new FileReader(); r.onload = ev => setPreview(ev.target?.result as string); r.readAsDataURL(f); }
                            }} />
                        </label>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Crop Type</label>
                            <select className="input" value={form.commodity} onChange={e => setForm(f => ({ ...f, commodity: e.target.value }))}>
                                {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Quality Grade</label>
                            <select className="input" value={form.qualityGrade} onChange={e => setForm(f => ({ ...f, qualityGrade: e.target.value }))}>
                                <option value="A">Grade A — Premium</option>
                                <option value="B">Grade B — Standard</option>
                                <option value="C">Grade C — Basic</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Quantity (kg)</label>
                        <input type="number" min={1} max={50000} className="input" value={form.quantityKg} onChange={e => setForm(f => ({ ...f, quantityKg: +e.target.value }))} />
                    </div>

                    {/* Valuation */}
                    <div style={{ padding: "14px 18px", borderRadius: 12, background: "var(--bg-muted)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--green-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <TrendingUp size={18} color="var(--green-600)" />
                        </div>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>MSP Valuation</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
                                {acVal.toLocaleString()} AC &nbsp;≈&nbsp; ₹{(acVal * AC_TO_INR).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Village</label>
                            <input type="text" className="input" placeholder="e.g. Amritsar" value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} />
                        </div>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>State</label>
                            <select className="input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                                <option value="">Select State</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Description</label>
                        <textarea className="input" rows={3} placeholder="Variety, harvest date, quality notes..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: "vertical" }} />
                    </div>

                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--green-50)", border: "1px solid var(--green-200)", display: "flex", gap: 10 }}>
                        <ShieldCheck size={16} color="var(--green-600)" style={{ flexShrink: 0, marginTop: 1 }} />
                        <p style={{ fontSize: 12, color: "var(--green-700)", lineHeight: 1.5 }}>
                            Listing will be <strong>community verified</strong> by 2 nearby farmers before credits are minted.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                        <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                            {loading
                                ? <><span className="anim-spin" style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block" }} /> Posting...</>
                                : <><Wheat size={15} /> Post Surplus</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Page ── */
export default function MarketplacePage() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>(DEMO);
    const [search, setSearch] = useState("");
    const [crop, setCrop] = useState("all");
    const [state, setState] = useState("all");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getListings().then(d => { if (d.length) setListings(d); }).catch(() => { });
    }, []);

    const filtered = listings.filter(l =>
        (!search || l.commodity.toLowerCase().includes(search.toLowerCase()) || l.village.toLowerCase().includes(search.toLowerCase()) || l.farmerName.toLowerCase().includes(search.toLowerCase())) &&
        (crop === "all" || l.commodity.toLowerCase() === crop) &&
        (state === "all" || l.state === state)
    );

    const totalKg = listings.reduce((a, l) => a + l.quantityKg, 0);
    const totalAC = listings.reduce((a, l) => a + l.askingPriceAC, 0);

    return (
        <div style={{ background: "var(--bg-canvas)", minHeight: "100vh" }}>

            {/* ── Banner ── */}
            <div className="gradient-brand" style={{ padding: "48px 0 40px" }}>
                <div className="container">
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                        <div>
                            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 800, color: "white", marginBottom: 8 }}>
                                AgriCredit Marketplace
                            </h1>
                            <p style={{ fontSize: 15, color: "var(--green-200)" }}>
                                Buy and sell surplus crops within 20 km radius. Geo-secure, escrow-protected.
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {[
                                { Icon: Layers, v: listings.length.toString(), l: "Listings" },
                                { Icon: Package, v: `${(totalKg / 1000).toFixed(1)}T`, l: "Volume" },
                                { Icon: Coins, v: totalAC.toLocaleString(), l: "AC Value" },
                            ].map(s => (
                                <div key={s.l} style={{ textAlign: "center", padding: "12px 20px", borderRadius: 14, background: "rgba(255,255,255,0.1)" }}>
                                    <s.Icon size={18} color="var(--green-300)" style={{ margin: "0 auto 6px" }} />
                                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "white" }}>{s.v}</div>
                                    <div style={{ fontSize: 11, color: "var(--green-300)" }}>{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="container" style={{ paddingTop: 28, paddingBottom: 0 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    {/* Search */}
                    <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
                        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
                        <input type="text" className="input" style={{ paddingLeft: 40 }} placeholder="Search crop, village, farmer…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>

                    {/* Crop filter */}
                    <select className="input" style={{ width: 160, flexShrink: 0 }} value={crop} onChange={e => setCrop(e.target.value)}>
                        <option value="all">All Crops</option>
                        {["wheat", "rice", "maize", "tomato", "onion", "potato", "groundnut", "mustard", "soybean"].map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                    </select>

                    {/* State filter */}
                    <select className="input" style={{ width: 180, flexShrink: 0 }} value={state} onChange={e => setState(e.target.value)}>
                        <option value="all">All States</option>
                        {["Punjab", "Uttar Pradesh", "Maharashtra", "Gujarat", "Rajasthan", "Andhra Pradesh"].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <button
                        id="post-btn"
                        onClick={() => user ? setShowModal(true) : toast.error("Login to post surplus")}
                        className="btn btn-primary"
                        style={{ flexShrink: 0 }}
                    >
                        <Plus size={16} /> Post Surplus
                    </button>
                </div>

                <div style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 16 }}>
                    Showing <strong style={{ color: "var(--text-secondary)" }}>{filtered.length}</strong> listings
                    {search && <> for &ldquo;<em>{search}</em>&rdquo;</>}
                </div>
            </div>

            {/* ── Grid ── */}
            <div className="container" style={{ paddingTop: 20, paddingBottom: 60 }}>
                {filtered.length > 0
                    ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                        {filtered.map(l => <ListingCard key={l.id} l={l} />)}
                    </div>
                    : <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <Package size={28} color="var(--text-faint)" />
                        </div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>No listings found</h3>
                        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Try adjusting your filters or be first to post!</p>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: 20 }}>
                            <Plus size={16} /> Post First Listing
                        </button>
                    </div>
                }
            </div>

            {showModal && <PostModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
