"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AC_TO_INR, calculateFee } from "@/lib/agriCredit";
import { Send, Lock, CheckCircle2, ShieldCheck, ArrowLeft, MapPin, Clock, Wheat } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// Demo listing data
const DEMO_LISTING = {
    id: "demo1",
    farmerId: "u1",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98765*****",
    commodity: "wheat",
    quantityKg: 200,
    qualityGrade: "A",
    askingPriceAC: 220,
    mspValueAC: 200,
    village: "Amritsar",
    state: "Punjab",
    description: "Fresh Sharbati wheat, properly dried and cleaned. Grade A quality. Suitable for atta mills.",
    verificationCount: 2,
    verified: true,
    trustScore: 87,
};

interface Message {
    id: string;
    sender: "buyer" | "farmer";
    text: string;
    time: Date;
}

const INITIAL_MESSAGES: Message[] = [
    { id: "1", sender: "farmer", text: "Jai Kisan! 🌾 Main Ramesh Kumar hoon, Amritsar se. Mera wheat Grade A hai, 2024 harvest.", time: new Date(Date.now() - 300000) },
    { id: "2", sender: "farmer", text: "Quantity 200kg hai. Aap kab lena chahte ho?", time: new Date(Date.now() - 240000) },
];

export default function TradePage() {
    const params = useParams();
    const router = useRouter();
    const { user, profile } = useAuth();
    const [step, setStep] = useState<"chat" | "confirm" | "escrow" | "complete">("chat");
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [offerAC, setOfferAC] = useState(220);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const listing = DEMO_LISTING; // In production: fetch by params.id
    const { fee, sellerReceives } = calculateFee(offerAC);
    const inrValue = offerAC * AC_TO_INR;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            sender: "buyer",
            text: input.trim(),
            time: new Date(),
        }]);
        setInput("");
        // Simulate farmer auto-response
        setTimeout(() => {
            const replies = [
                "Theek hai! Price discuss karte hain.",
                "Grade A certificate hai mere paas.",
                "Delivery 2 din mein kar sakta hoon.",
                "AgriCredit mein bilkul accept karta hoon!",
            ];
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: "farmer",
                text: replies[Math.floor(Math.random() * replies.length)],
                time: new Date(),
            }]);
        }, 1000 + Math.random() * 1000);
    };

    const handleConfirmTrade = async () => {
        if (!user) {
            toast.error("Please login to trade");
            router.push("/login");
            return;
        }
        if ((profile?.agriCredits || 0) < offerAC) {
            toast.error(`Insufficient AgriCredits. You have ${profile?.agriCredits} AC, need ${offerAC} AC`);
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setStep("escrow");
        setLoading(false);
        toast.success("Trade confirmed! Escrow locked 🔐");
    };

    const handleCompleteDelivery = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setStep("complete");
        setLoading(false);
        toast.success(`Trade completed! ${sellerReceives} AC sent to farmer 🎉`);
    };

    const formatTime = (date: Date) => date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="min-h-screen" style={{ background: "#f0fdf4" }}>
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Back */}
                <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm mb-4" style={{ color: "#16a34a" }}>
                    <ArrowLeft size={16} /> Back to Marketplace
                </Link>

                {/* Listing Summary */}
                <div className="card-solid mb-6 p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex gap-4 items-start">
                            <div className="text-4xl">🌾</div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-xl font-bold capitalize" style={{ color: "#14532d" }}>
                                        {listing.commodity} — Grade {listing.qualityGrade}
                                    </h1>
                                    {listing.verified && (
                                        <span className="verified-badge flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm mb-2" style={{ color: "#4b7c5c" }}>{listing.description}</p>
                                <div className="flex flex-wrap gap-3 text-sm" style={{ color: "#6b7280" }}>
                                    <span className="flex items-center gap-1"><MapPin size={14} />{listing.village}, {listing.state}</span>
                                    <span>📦 {listing.quantityKg}kg</span>
                                    <span>⭐ Trust: {listing.trustScore}/100</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="ac-badge text-lg mb-1">🌾 {listing.askingPriceAC} AC</div>
                            <div className="text-sm" style={{ color: "#4b7c5c" }}>≈ ₹{(listing.askingPriceAC * AC_TO_INR).toLocaleString("en-IN")}</div>
                            <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>MSP Ref: {listing.mspValueAC} AC</div>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto py-2">
                    {[
                        { key: "chat", label: "💬 Chat" },
                        { key: "confirm", label: "🤝 Confirm Trade" },
                        { key: "escrow", label: "🔐 Escrow Active" },
                        { key: "complete", label: "✅ Complete" },
                    ].map((s, i) => {
                        const stepOrder = ["chat", "confirm", "escrow", "complete"];
                        const isActive = step === s.key;
                        const isDone = stepOrder.indexOf(step) > stepOrder.indexOf(s.key);
                        return (
                            <div key={s.key} className="flex items-center gap-2 flex-shrink-0">
                                <div
                                    className="px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap"
                                    style={{
                                        background: isActive ? "#16a34a" : isDone ? "#dcfce7" : "white",
                                        color: isActive ? "white" : isDone ? "#166534" : "#9ca3af",
                                        border: `1px solid ${isActive ? "#16a34a" : isDone ? "#bbf7d0" : "#e5e7eb"}`,
                                    }}
                                >
                                    {s.label}
                                </div>
                                {i < 3 && <div className="w-8 h-0.5" style={{ background: isDone ? "#16a34a" : "#e5e7eb" }} />}
                            </div>
                        );
                    })}
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    {/* Chat Panel */}
                    <div className="md:col-span-3 card-solid overflow-hidden flex flex-col" style={{ height: "480px" }}>
                        <div
                            className="px-4 py-3 flex items-center gap-3"
                            style={{ borderBottom: "1px solid #dcfce7", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}
                        >
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl" style={{ background: "#14532d" }}>
                                👨‍🌾
                            </div>
                            <div>
                                <div className="font-semibold text-sm" style={{ color: "#14532d" }}>{listing.farmerName}</div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-xs" style={{ color: "#6b7280" }}>Online • {listing.village}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                                    <div className="max-w-[80%]">
                                        <div
                                            className="px-4 py-2.5 rounded-2xl text-sm"
                                            style={
                                                msg.sender === "buyer"
                                                    ? { background: "linear-gradient(135deg, #16a34a, #059669)", color: "white", borderBottomRightRadius: "4px" }
                                                    : { background: "white", color: "#14532d", border: "1px solid #dcfce7", borderBottomLeftRadius: "4px" }
                                            }
                                        >
                                            {msg.text}
                                        </div>
                                        <div className="text-xs mt-1 px-1" style={{ color: "#9ca3af", textAlign: msg.sender === "buyer" ? "right" : "left" }}>
                                            {formatTime(msg.time)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        <div className="p-3 flex gap-2" style={{ borderTop: "1px solid #dcfce7" }}>
                            <input
                                type="text"
                                className="input-field py-2 text-sm flex-1"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #16a34a, #059669)", color: "white" }}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Trade Panel */}
                    <div className="md:col-span-2 space-y-4">
                        {step === "complete" ? (
                            <div className="card-solid p-6 text-center">
                                <div className="text-6xl mb-4">🎉</div>
                                <h2 className="text-xl font-bold mb-2" style={{ color: "#14532d" }}>Trade Completed!</h2>
                                <p className="text-sm mb-4" style={{ color: "#4b7c5c" }}>
                                    {sellerReceives} AC released to {listing.farmerName}. Platform fee: {fee} AC.
                                </p>
                                <div className="ac-badge text-sm mx-auto justify-center mb-4">
                                    🌾 You earned +10 AC
                                </div>
                                <Link href="/marketplace" className="btn-primary w-full justify-center">
                                    Back to Marketplace
                                </Link>
                            </div>
                        ) : step === "escrow" ? (
                            <div className="card-solid p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lock size={20} style={{ color: "#16a34a" }} />
                                    <h3 className="font-bold" style={{ color: "#14532d" }}>Escrow Active 🔐</h3>
                                </div>
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm">
                                        <span style={{ color: "#6b7280" }}>Locked Amount</span>
                                        <span className="font-bold" style={{ color: "#14532d" }}>{offerAC} AC</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span style={{ color: "#6b7280" }}>Platform Fee (1%)</span>
                                        <span style={{ color: "#dc2626" }}>-{fee} AC</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span style={{ color: "#14532d" }}>Farmer Receives</span>
                                        <span style={{ color: "#16a34a" }}>{sellerReceives} AC</span>
                                    </div>
                                </div>
                                <div
                                    className="p-3 rounded-xl text-sm mb-4"
                                    style={{ background: "#fef3c7", color: "#92400e" }}
                                >
                                    ⏳ Confirm delivery after receiving produce
                                </div>
                                <button
                                    id="confirm-delivery-btn"
                                    onClick={handleCompleteDelivery}
                                    disabled={loading}
                                    className="btn-primary w-full"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Completing...
                                        </span>
                                    ) : (
                                        <><CheckCircle2 size={16} /> Confirm Delivery Received</>
                                    )}
                                </button>
                            </div>
                        ) : step === "confirm" ? (
                            <div className="card-solid p-5">
                                <h3 className="font-bold mb-4" style={{ color: "#14532d" }}>🤝 Confirm Trade</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#166534" }}>
                                        Your Offer (AgriCredits)
                                    </label>
                                    <input
                                        type="number"
                                        min={listing.mspValueAC}
                                        max={listing.askingPriceAC * 1.5}
                                        className="input-field"
                                        value={offerAC}
                                        onChange={(e) => setOfferAC(+e.target.value)}
                                    />
                                    <div className="text-xs mt-1" style={{ color: "#6b7280" }}>
                                        ≈ ₹{(offerAC * AC_TO_INR).toLocaleString("en-IN")} | MSP floor: {listing.mspValueAC} AC
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Trade Amount</span>
                                        <span className="font-medium">{offerAC} AC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Fee (1%)</span>
                                        <span style={{ color: "#dc2626" }}>-{fee} AC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Farmer Gets</span>
                                        <span style={{ color: "#16a34a" }} className="font-bold">{sellerReceives} AC</span>
                                    </div>
                                    <hr style={{ borderColor: "#dcfce7" }} />
                                    <div className="flex justify-between font-bold">
                                        <span style={{ color: "#14532d" }}>Your Balance Needed</span>
                                        <span style={{ color: "#14532d" }}>{offerAC} AC</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 p-3 rounded-xl text-xs mb-4" style={{ background: "#dcfce7", color: "#16a34a" }}>
                                    <ShieldCheck size={14} className="flex-shrink-0 mt-0.5" />
                                    <span>Your ACs will be locked in escrow. Released only after you confirm delivery.</span>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => setStep("chat")} className="btn-secondary flex-1 text-sm py-2.5">← Back</button>
                                    <button
                                        id="confirm-trade-btn"
                                        onClick={handleConfirmTrade}
                                        disabled={loading}
                                        className="btn-primary flex-1 text-sm py-2.5"
                                    >
                                        {loading ? (
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <><Lock size={14} /> Lock Escrow</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card-solid p-5 space-y-3">
                                <h3 className="font-bold" style={{ color: "#14532d" }}>Trade Summary</h3>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Seller</span>
                                        <span className="font-medium">{listing.farmerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Quantity</span>
                                        <span>{listing.quantityKg}kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Asking Price</span>
                                        <span className="font-bold" style={{ color: "#16a34a" }}>{listing.askingPriceAC} AC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#6b7280" }}>Your Balance</span>
                                        <span>{profile?.agriCredits ?? "—"} AC</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === "chat" && (
                            <button
                                onClick={() => {
                                    if (!user) { toast.error("Please login to trade"); router.push("/login"); return; }
                                    setStep("confirm");
                                }}
                                className="btn-primary w-full"
                            >
                                <Wheat size={16} /> Proceed to Trade
                            </button>
                        )}

                        {/* Geo Info */}
                        <div className="card-solid p-4 text-sm">
                            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: "#14532d" }}>
                                <MapPin size={15} /> Geographic Constraint
                            </div>
                            <p style={{ color: "#4b7c5c" }}>
                                This trade is available within a <strong>20km radius</strong> of {listing.village}. Geographic matching ensures practical delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
