"use client";

import { MSP_RATES, AC_TO_INR, INR_TO_AC } from "@/lib/agriCredit";
import { useState } from "react";
import { Search, TrendingUp, TrendingDown, Minus, Wheat } from "lucide-react";

const EXTENDED_PRICES = Object.entries(MSP_RATES).map(([crop, mspPerQtl]) => {
    const mspPerKg = mspPerQtl / 100;
    const acPerKg = mspPerKg * INR_TO_AC;
    const change = (Math.random() - 0.5) * 6; // simulated price movement
    return {
        crop: crop.charAt(0).toUpperCase() + crop.slice(1),
        cropKey: crop,
        mspPerQtl,
        mspPerKg: +mspPerKg.toFixed(2),
        acPerKg: +acPerKg.toFixed(3),
        acPer100kg: +(100 * acPerKg).toFixed(1),
        change: +change.toFixed(1),
        mandis: Math.floor(50 + Math.random() * 200),
        arrivals: Math.floor(100 + Math.random() * 2000),
    };
});

const EMOJI: Record<string, string> = {
    wheat: "🌾", rice: "🍚", maize: "🌽", soybean: "🌱", cotton: "🧶",
    sugarcane: "🎋", onion: "🧅", tomato: "🍅", potato: "🥔",
    mustard: "🫙", groundnut: "🥜", sunflower: "🌻", jowar: "🌾",
    bajra: "🌾", barley: "🌾", lentil: "🫘", chickpea: "🫘",
};

export default function PricesPage() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "price" | "change">("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const filtered = EXTENDED_PRICES
        .filter((p) => !search || p.crop.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const mult = sortDir === "asc" ? 1 : -1;
            if (sortBy === "name") return mult * a.crop.localeCompare(b.crop);
            if (sortBy === "price") return mult * (a.mspPerQtl - b.mspPerQtl);
            return mult * (a.change - b.change);
        });

    const handleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortBy(col); setSortDir("asc"); }
    };

    return (
        <div className="min-h-screen" style={{ background: "#f0fdf4" }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }} className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                        📊 Live MSP Prices
                    </h1>
                    <p className="text-green-200 text-lg">
                        Government-mandated MSP 2024-25 + live AgriCredit conversion rates
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-green-300">
                        <span>1 AC = ₹{AC_TO_INR} (MSP Pegged)</span>
                        <span>•</span>
                        <span>Updated: Today, {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        <span>•</span>
                        <span>Season: Kharif & Rabi 2024-25</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#16a34a" }} />
                        <input
                            type="text"
                            className="input-field pl-10"
                            placeholder="Search commodity..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {["name", "price", "change"].map((col) => (
                            <button
                                key={col}
                                onClick={() => handleSort(col as typeof sortBy)}
                                className="px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
                                style={{
                                    background: sortBy === col ? "#16a34a" : "white",
                                    color: sortBy === col ? "white" : "#166534",
                                    border: "1px solid",
                                    borderColor: sortBy === col ? "#16a34a" : "#dcfce7",
                                }}
                            >
                                {col} {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Card Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {filtered.map((item) => (
                        <div key={item.cropKey} className="card-solid p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl">{EMOJI[item.cropKey] || "🌿"}</span>
                                    <div>
                                        <div className="font-bold" style={{ color: "#14532d" }}>{item.crop}</div>
                                        <div className="text-xs" style={{ color: "#9ca3af" }}>{item.mandis} mandis</div>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                                    style={{
                                        background: item.change > 0 ? "#dcfce7" : item.change < 0 ? "#fef2f2" : "#f3f4f6",
                                        color: item.change > 0 ? "#16a34a" : item.change < 0 ? "#dc2626" : "#6b7280",
                                    }}
                                >
                                    {item.change > 0 ? <TrendingUp size={12} /> : item.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                                    {item.change > 0 ? "+" : ""}{item.change}%
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span style={{ color: "#6b7280" }}>MSP/quintal</span>
                                    <span className="font-bold" style={{ color: "#14532d" }}>₹{item.mspPerQtl.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: "#6b7280" }}>MSP/kg</span>
                                    <span style={{ color: "#166534" }}>₹{item.mspPerKg}</span>
                                </div>
                                <hr style={{ borderColor: "#f0fdf4" }} />
                                <div className="flex justify-between">
                                    <span style={{ color: "#6b7280" }}>Per kg in AC</span>
                                    <span className="ac-badge text-xs">{item.acPerKg} AC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: "#6b7280" }}>100kg = </span>
                                    <span className="font-bold" style={{ color: "#16a34a" }}>{item.acPer100kg} AC</span>
                                </div>
                            </div>

                            <div
                                className="mt-3 text-xs p-2 rounded-lg flex justify-between"
                                style={{ background: "#f0fdf4" }}
                            >
                                <span style={{ color: "#4b7c5c" }}>Arrivals today</span>
                                <span className="font-medium" style={{ color: "#14532d" }}>{item.arrivals.toLocaleString()} MT</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="card-solid p-5">
                    <h3 className="font-bold mb-3" style={{ color: "#14532d" }}>📌 How to Read This</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm" style={{ color: "#4b7c5c" }}>
                        <div>
                            <strong>MSP (Minimum Support Price)</strong> is set by the Government of India.
                            It acts as the <em>floor price</em> — farmers should never get less than this.
                        </div>
                        <div>
                            <strong>AgriCredit (AC)</strong> is pegged to wheat MSP per kg = ₹{AC_TO_INR}.
                            All crop conversions use this base, giving fair relative values.
                        </div>
                        <div>
                            <strong>% Change</strong> shows today&apos;s market price relative to MSP.
                            Positive = market premium above MSP (good for farmers).
                        </div>
                        <div>
                            <strong>Arrivals</strong> is the quantity brought to mandis today in metric tonnes.
                            High arrivals often correlate with lower prices (supply-demand).
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
