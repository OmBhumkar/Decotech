"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getListings, Listing } from "@/lib/marketplace";
import { commodityToAC, AC_TO_INR } from "@/lib/agriCredit";
import {
    Search, Plus, Filter, MapPin, Wheat, CheckCircle2, Clock,
    Upload, Star, ArrowRight, TrendingUp, Package, ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

// Demo listings for when Firestore is empty
const DEMO_LISTINGS: Listing[] = [
    {
        id: "demo1",
        farmerId: "u1",
        farmerName: "Ramesh Kumar",
        farmerPhone: "+91 98765*****",
        commodity: "wheat",
        category: "Food Grains",
        quantityKg: 200,
        qualityGrade: "A",
        askingPriceAC: 220,
        mspValueAC: 200,
        imageUrl: "",
        village: "Amritsar",
        state: "Punjab",
        lat: 31.63,
        lng: 74.87,
        description: "Fresh Sharbati wheat, properly dried and cleaned. Grade A quality.",
        verificationCount: 2,
        verified: true,
        status: "active",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    },
    {
        id: "demo2",
        farmerId: "u2",
        farmerName: "Sukhbir Yadav",
        farmerPhone: "+91 87654*****",
        commodity: "rice",
        category: "Food Grains",
        quantityKg: 500,
        qualityGrade: "B",
        askingPriceAC: 510,
        mspValueAC: 500,
        imageUrl: "",
        village: "Gorakhpur",
        state: "Uttar Pradesh",
        lat: 26.76,
        lng: 83.37,
        description: "Basmati variety, 2024 harvest. Excellent aroma.",
        verificationCount: 1,
        verified: false,
        status: "active",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    },
    {
        id: "demo3",
        farmerId: "u3",
        farmerName: "Priya Devi",
        farmerPhone: "+91 76543*****",
        commodity: "tomato",
        category: "Vegetables",
        quantityKg: 100,
        qualityGrade: "A",
        askingPriceAC: 28,
        mspValueAC: 26,
        imageUrl: "",
        village: "Nashik",
        state: "Maharashtra",
        lat: 19.99,
        lng: 73.79,
        description: "Hybrid tomatoes, fresh picked today. Urgent sale.",
        verificationCount: 3,
        verified: true,
        status: "active",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
        id: "demo4",
        farmerId: "u4",
        farmerName: "Mehul Patel",
        farmerPhone: "+91 65432*****",
        commodity: "groundnut",
        category: "Oilseeds",
        quantityKg: 300,
        qualityGrade: "A",
        askingPriceAC: 905,
        mspValueAC: 890,
        imageUrl: "",
        village: "Rajkot",
        state: "Gujarat",
        lat: 22.30,
        lng: 70.80,
        description: "Bold variety groundnut, oil content 48%+. FPO aggregated batch.",
        verificationCount: 2,
        verified: true,
        status: "active",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    },
    {
        id: "demo5",
        farmerId: "u5",
        farmerName: "Leela Bai",
        farmerPhone: "+91 54321*****",
        commodity: "onion",
        category: "Vegetables",
        quantityKg: 800,
        qualityGrade: "B",
        askingPriceAC: 285,
        mspValueAC: 280,
        imageUrl: "",
        village: "Solapur",
        state: "Maharashtra",
        lat: 17.68,
        lng: 75.91,
        description: "Red onion, post-monsoon. 6–8cm size. Well dried outer skin.",
        verificationCount: 2,
        verified: true,
        status: "active",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    },
    {
        id: "demo6",
        farmerId: "u6",
        farmerName: "Arjun Das",
        farmerPhone: "+91 98123*****",
        commodity: "mustard",
        category: "Oilseeds",
        quantityKg: 150,
        qualityGrade: "A",
        askingPriceAC: 400,
        mspValueAC: 391,
        imageUrl: "",
        village: "Bharatpur",
        state: "Rajasthan",
        lat: 27.21,
        lng: 77.49,
        description: "Yellow mustard, high erucic acid content. 2024 rabi harvest.",
        verificationCount: 1,
        verified: false,
        status: "active",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
    },
];

const CROP_EMOJI: Record<string, string> = {
    wheat: "🌾", rice: "🍚", maize: "🌽", tomato: "🍅", onion: "🧅",
    potato: "🥔", groundnut: "🥜", mustard: "🫙", sugarcane: "🎋",
    cotton: "🧶", soybean: "🌱", default: "🌿",
};

function getTimeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

function ListingCard({ listing }: { listing: Listing }) {
    const emoji = CROP_EMOJI[listing.commodity] || CROP_EMOJI.default;
    const inrValue = listing.askingPriceAC * AC_TO_INR;
    const pricePerKg = inrValue / listing.quantityKg;

    return (
        <div className="card-solid hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Crop header with emoji */}
            <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-3xl">{emoji}</span>
                    <div>
                        <div className="font-bold capitalize" style={{ color: "#14532d" }}>
                            {listing.commodity}
                        </div>
                        <div className="text-xs" style={{ color: "#6b7280" }}>
                            <span
                                className={`px-1.5 py-0.5 rounded text-xs font-bold ${listing.qualityGrade === "A" ? "bg-green-100 text-green-700" :
                                        listing.qualityGrade === "B" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                Grade {listing.qualityGrade}
                            </span>
                            {" "}{listing.category}
                        </div>
                    </div>
                </div>
                {listing.verified ? (
                    <div className="verified-badge flex items-center gap-1">
                        <CheckCircle2 size={12} /> Verified
                    </div>
                ) : (
                    <div
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "#fef3c7", color: "#92400e" }}
                    >
                        <Clock size={12} /> Pending ({listing.verificationCount}/2)
                    </div>
                )}
            </div>

            <div className="p-4">
                {/* Price */}
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <div className="ac-badge text-lg mb-1">🌾 {listing.askingPriceAC.toLocaleString()} AC</div>
                        <div className="text-sm font-medium" style={{ color: "#4b7c5c" }}>
                            ≈ ₹{inrValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </div>
                    </div>
                    <div className="text-right text-sm" style={{ color: "#6b7280" }}>
                        <div className="font-medium" style={{ color: "#14532d" }}>
                            {listing.quantityKg.toLocaleString()} kg
                        </div>
                        <div>₹{pricePerKg.toFixed(1)}/kg</div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-3 line-clamp-2" style={{ color: "#4b7c5c" }}>
                    {listing.description}
                </p>

                {/* Farmer & Location */}
                <div className="flex items-center justify-between text-xs mb-4" style={{ color: "#6b7280" }}>
                    <div className="flex items-center gap-1">
                        <span className="font-medium" style={{ color: "#14532d" }}>{listing.farmerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {listing.village}, {listing.state}
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-3" style={{ color: "#9ca3af" }}>
                    <span><Clock size={11} className="inline mr-1" />{getTimeAgo(listing.createdAt)}</span>
                    <span>MSP: {listing.mspValueAC} AC</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Link
                        href={`/trade/${listing.id}`}
                        className="btn-primary flex-1 text-sm py-2.5"
                    >
                        Buy Now <ArrowRight size={14} />
                    </Link>
                    <Link
                        href={`/chat/${listing.id}`}
                        className="btn-secondary px-3 py-2.5 text-sm"
                        title="Chat with farmer"
                    >
                        💬
                    </Link>
                </div>
            </div>
        </div>
    );
}

function PostSurplusModal({ onClose }: { onClose: () => void }) {
    const { user, profile } = useAuth();
    const [form, setForm] = useState({
        commodity: "wheat",
        quantityKg: 100,
        qualityGrade: "A",
        description: "",
        village: profile?.village || "",
        state: profile?.state || "",
        imageFile: null as File | null,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [acValue, setAcValue] = useState(0);

    useEffect(() => {
        setAcValue(commodityToAC(form.commodity, form.quantityKg));
    }, [form.commodity, form.quantityKg]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm((f) => ({ ...f, imageFile: file }));
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) { toast.error("Please login first"); return; }
        if (!form.imageFile) { toast.error("Please upload a crop image for verification"); return; }

        setLoading(true);
        try {
            // Demo mode: just show success (Firestore would be called in production)
            await new Promise((r) => setTimeout(r, 1200));
            toast.success(`Listing created! You earned 5 AgriCredits 🌾`);
            onClose();
        } catch (err) {
            toast.error("Failed to create listing. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const CROPS = ["wheat", "rice", "maize", "soybean", "mustard", "groundnut", "cotton", "sugarcane", "onion", "tomato", "potato", "lentil", "chickpea", "barley", "jowar", "bajra"];
    const STATES = ["Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div
                className="w-full max-w-lg rounded-2xl overflow-hidden"
                style={{ background: "white", maxHeight: "90vh", overflowY: "auto" }}
            >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}>
                    <div>
                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                            Post Surplus Material
                        </h2>
                        <p className="text-green-200 text-sm">Earn AgriCredits for listing</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "#14532d" }}>
                            📸 Crop Image <span className="text-red-500">*</span>
                            <span className="text-xs font-normal ml-2" style={{ color: "#6b7280" }}>(Required for community verification)</span>
                        </label>
                        <label
                            className="w-full h-36 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-colors"
                            style={{
                                border: "2px dashed #bbf7d0",
                                background: preview ? "transparent" : "#f0fdf4",
                            }}
                        >
                            {preview ? (
                                <img src={preview} alt="Crop" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <>
                                    <Upload size={28} style={{ color: "#16a34a" }} />
                                    <span className="mt-2 text-sm font-medium" style={{ color: "#16a34a" }}>Click to upload crop image</span>
                                    <span className="text-xs" style={{ color: "#9ca3af" }}>JPG, PNG up to 5MB</span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Crop Type</label>
                            <select
                                className="input-field capitalize"
                                value={form.commodity}
                                onChange={(e) => setForm((f) => ({ ...f, commodity: e.target.value }))}
                            >
                                {CROPS.map((c) => (
                                    <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Quality Grade</label>
                            <select
                                className="input-field"
                                value={form.qualityGrade}
                                onChange={(e) => setForm((f) => ({ ...f, qualityGrade: e.target.value }))}
                            >
                                <option value="A">Grade A (Premium)</option>
                                <option value="B">Grade B (Standard)</option>
                                <option value="C">Grade C (Basic)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Quantity (kg)</label>
                        <input
                            type="number"
                            min={1}
                            max={50000}
                            className="input-field"
                            value={form.quantityKg}
                            onChange={(e) => setForm((f) => ({ ...f, quantityKg: +e.target.value }))}
                        />
                    </div>

                    {/* AgriCredit Valuation */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "#fef3c7", border: "1px solid #fde68a" }}
                    >
                        <TrendingUp size={20} style={{ color: "#92400e" }} />
                        <div>
                            <div className="text-xs font-semibold" style={{ color: "#92400e" }}>MSP Valuation</div>
                            <div className="font-bold" style={{ color: "#92400e" }}>
                                {acValue.toLocaleString()} AgriCredits ≈ ₹{(acValue * AC_TO_INR).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Village</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. Amritsar"
                                value={form.village}
                                onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>State</label>
                            <select
                                className="input-field"
                                value={form.state}
                                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                            >
                                <option value="">Select State</option>
                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Description</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            placeholder="Describe your produce: variety, harvest date, quality notes..."
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        />
                    </div>

                    <div
                        className="flex items-start gap-2 p-3 rounded-xl text-xs"
                        style={{ background: "#dcfce7", color: "#16a34a" }}
                    >
                        <ShieldCheck size={14} className="flex-shrink-0 mt-0.5" />
                        <span>Listing will be <strong>community verified</strong> by 2 nearby farmers before credits are minted. You earn +5 AC for listing!</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Listing...
                                </span>
                            ) : (
                                <>Post Surplus <Wheat size={16} /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MarketplacePage() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS);
    const [search, setSearch] = useState("");
    const [filterCrop, setFilterCrop] = useState("all");
    const [filterState, setFilterState] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getListings();
                setListings(data.length > 0 ? data : DEMO_LISTINGS);
            } catch {
                // Use demo data if Firestore not configured
                setListings(DEMO_LISTINGS);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = listings.filter((l) => {
        const matchSearch =
            !search ||
            l.commodity.toLowerCase().includes(search.toLowerCase()) ||
            l.village.toLowerCase().includes(search.toLowerCase()) ||
            l.farmerName.toLowerCase().includes(search.toLowerCase());
        const matchCrop = filterCrop === "all" || l.commodity === filterCrop;
        const matchState = filterState === "all" || l.state === filterState;
        return matchSearch && matchCrop && matchState;
    });

    const totalVolume = listings.reduce((s, l) => s + l.quantityKg, 0);
    const totalAC = listings.reduce((s, l) => s + l.askingPriceAC, 0);

    return (
        <div className="min-h-screen" style={{ background: "#f0fdf4" }}>
            {/* Hero Banner */}
            <div style={{ background: "linear-gradient(135deg, #14532d, #166534)" }} className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                                AgriCredit Marketplace 🛒
                            </h1>
                            <p className="text-green-300 text-lg">Buy and sell surplus crops within 20km radius. Geo-secure, escrow-protected.</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                                <div className="text-2xl font-bold text-white">{listings.length}</div>
                                <div className="text-green-300 text-xs">Active Listings</div>
                            </div>
                            <div className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                                <div className="text-2xl font-bold text-white">{(totalVolume / 1000).toFixed(1)}T</div>
                                <div className="text-green-300 text-xs">Crop Volume</div>
                            </div>
                            <div className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                                <div className="ac-badge text-sm">{totalAC.toLocaleString()} AC</div>
                                <div className="text-green-300 text-xs mt-1">Total Value</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#16a34a" }} />
                        <input
                            type="text"
                            className="input-field pl-10"
                            placeholder="Search crop, village, farmer name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="input-field w-full sm:w-44"
                        value={filterCrop}
                        onChange={(e) => setFilterCrop(e.target.value)}
                    >
                        <option value="all">All Crops</option>
                        {["wheat", "rice", "maize", "tomato", "onion", "potato", "groundnut", "mustard", "soybean"].map((c) => (
                            <option key={c} value={c} className="capitalize">{c}</option>
                        ))}
                    </select>
                    <select
                        className="input-field w-full sm:w-44"
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                    >
                        <option value="all">All States</option>
                        {["Punjab", "Uttar Pradesh", "Maharashtra", "Gujarat", "Rajasthan", "Andhra Pradesh"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <button
                        id="post-surplus-btn"
                        onClick={() => user ? setShowModal(true) : toast.error("Please login to post surplus")}
                        className="btn-primary flex-shrink-0"
                    >
                        <Plus size={18} /> Post Surplus
                    </button>
                </div>

                {/* Listing Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="card-solid p-4 h-72 shimmer" />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <>
                        <div className="text-sm mb-4" style={{ color: "#166534" }}>
                            Showing <strong>{filtered.length}</strong> listings {search && `for "${search}"`}
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🌾</div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: "#14532d" }}>No listings found</h3>
                        <p style={{ color: "#6b7280" }}>Try changing your search filters or be the first to post!</p>
                        <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
                            <Plus size={16} /> Post First Listing
                        </button>
                    </div>
                )}
            </div>

            {/* Post Surplus Modal */}
            {showModal && <PostSurplusModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
