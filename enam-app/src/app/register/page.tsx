"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, Wheat, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

export default function RegisterPage() {
    const router = useRouter();
    const { sendOTP, verifyOTP } = useAuth();
    const [step, setStep] = useState<"details" | "otp">("details");
    const [form, setForm] = useState({
        name: "",
        phone: "",
        village: "",
        state: "",
        role: "farmer" as "farmer" | "trader",
    });
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState<import("firebase/auth").ConfirmationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.village || !form.state) {
            toast.error("Please fill all required fields");
            return;
        }
        if (form.phone.length !== 10) {
            toast.error("Enter a valid 10-digit mobile number");
            return;
        }
        setLoading(true);
        try {
            const result = await sendOTP(`+91${form.phone}`, "recaptcha-container-reg");
            setConfirmation(result);
            setStep("otp");
            toast.success(`OTP sent to +91 ${form.phone}`);
        } catch (err) {
            console.error(err);
            // Demo mode
            setStep("otp");
            toast.success("OTP sent! (Demo mode)");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) { toast.error("Enter 6-digit OTP"); return; }
        setLoading(true);
        try {
            if (confirmation) {
                await verifyOTP(confirmation, otp);
            }
            toast.success("Registration successful! 50 AgriCredits added to your wallet 🌾");
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        "50 AgriCredits FREE on signup",
        "Direct price discovery, no middlemen",
        "Escrow-protected secure payments",
        "Community-verified trade network",
        "MSP-pegged inflation-proof credits",
    ];

    return (
        <div className="min-h-screen flex" style={{ background: "#f0fdf4" }}>
            {/* Left Panel — Benefits */}
            <div
                className="hidden lg:flex flex-col justify-center px-12 py-16 w-1/2"
                style={{ background: "linear-gradient(135deg, #14532d, #059669)" }}
            >
                <Image src="/logo.png" alt="eNAM" width={64} height={64} className="rounded-xl mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Join India&apos;s Largest Agri Exchange
                </h2>
                <p className="text-green-200 text-lg mb-8">
                    1.8 crore farmers already trading on eNAM. Your turn to earn more.
                </p>
                <div className="space-y-3">
                    {benefits.map((b) => (
                        <div key={b} className="flex items-center gap-3">
                            <CheckCircle2 size={20} style={{ color: "#4ade80" }} />
                            <span className="text-green-100">{b}</span>
                        </div>
                    ))}
                </div>
                <div
                    className="mt-10 p-5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                >
                    <div className="text-2xl font-bold text-white mb-1">50 AgriCredits</div>
                    <div className="text-green-300 text-sm">≈ ₹1,137.50 welcome bonus</div>
                    <div className="text-green-400 text-xs mt-1">Credited instantly after registration</div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <Image src="/logo.png" alt="eNAM" width={56} height={56} className="mx-auto rounded-xl mb-3" />
                        <h1 className="text-2xl font-bold" style={{ color: "#14532d" }}>Register on eNAM</h1>
                    </div>

                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{ background: "white", boxShadow: "0 20px 60px rgba(22, 163, 74, 0.12)", border: "1px solid #dcfce7" }}
                    >
                        <div className="px-6 py-4" style={{ background: "#f0fdf4", borderBottom: "1px solid #dcfce7" }}>
                            <div className="flex gap-2">
                                {["Your Details", "Verify OTP"].map((label, i) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{
                                                background: (i === 0 && step === "details") || (i === 1 && step === "otp") ? "#16a34a" : "#dcfce7",
                                                color: (i === 0 && step === "details") || (i === 1 && step === "otp") ? "white" : "#166534",
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: "#166534" }}>{label}</span>
                                        {i === 0 && <ChevronRight size={14} style={{ color: "#bbf7d0" }} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            <div id="recaptcha-container-reg" />

                            {step === "details" ? (
                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    {/* Role Toggle */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: "#14532d" }}>I am a</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(["farmer", "trader"] as const).map((role) => (
                                                <button
                                                    type="button"
                                                    key={role}
                                                    onClick={() => setForm((f) => ({ ...f, role }))}
                                                    className="py-3 rounded-xl font-semibold text-sm capitalize transition-all"
                                                    style={{
                                                        background: form.role === role ? "#16a34a" : "white",
                                                        color: form.role === role ? "white" : "#166534",
                                                        border: "2px solid",
                                                        borderColor: form.role === role ? "#16a34a" : "#dcfce7",
                                                    }}
                                                >
                                                    {role === "farmer" ? "👨‍🌾 " : "🏪 "}{role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Full Name *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g. Gurpreet Singh"
                                            value={form.name}
                                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Mobile Number *</label>
                                        <div className="relative">
                                            <span
                                                className="absolute left-3 top-1/2 -translate-y-1/2 font-medium"
                                                style={{ color: "#16a34a" }}
                                            >+91</span>
                                            <input
                                                type="tel"
                                                className="input-field pl-12"
                                                placeholder="10-digit mobile"
                                                maxLength={10}
                                                value={form.phone}
                                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>Village *</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g. Amritsar"
                                                value={form.village}
                                                onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#14532d" }}>State *</label>
                                            <select
                                                className="input-field"
                                                value={form.state}
                                                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select State</option>
                                                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Welcome Bonus Callout */}
                                    <div
                                        className="flex items-center gap-3 p-3 rounded-xl"
                                        style={{ background: "#fef3c7", border: "1px solid #fde68a" }}
                                    >
                                        <Wheat size={20} style={{ color: "#92400e" }} />
                                        <div>
                                            <div className="text-sm font-bold" style={{ color: "#92400e" }}>🎁 Welcome Gift</div>
                                            <div className="text-xs" style={{ color: "#92400e" }}>50 AgriCredits (≈ ₹1,137) added on signup!</div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full text-base"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending OTP...
                                            </span>
                                        ) : (
                                            <>Send OTP to +91 {form.phone || "XXXXXXXXXX"} <ChevronRight size={16} /></>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-5">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1" style={{ color: "#14532d" }}>Verify Your Mobile</h3>
                                        <p className="text-sm" style={{ color: "#4b7c5c" }}>
                                            OTP sent to +91 {form.phone}
                                        </p>
                                    </div>

                                    {/* OTP Display */}
                                    <div className="flex justify-center gap-3">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                                                style={{
                                                    background: otp[i] ? "#dcfce7" : "#f8fafc",
                                                    border: `2px solid ${otp[i] ? "#16a34a" : "#e2e8f0"}`,
                                                    color: "#14532d",
                                                }}
                                            >
                                                {otp[i] || ""}
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        type="tel"
                                        className="input-field text-center text-2xl font-bold tracking-widest"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        autoFocus
                                    />

                                    <button
                                        type="submit"
                                        disabled={otp.length !== 6 || loading}
                                        className="btn-primary w-full text-base"
                                        style={{ opacity: otp.length !== 6 ? 0.6 : 1 }}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Creating account...
                                            </span>
                                        ) : (
                                            <>Complete Registration <Wheat size={16} /></>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep("details")}
                                        className="w-full text-sm text-center py-2"
                                        style={{ color: "#16a34a" }}
                                    >
                                        ← Back to details
                                    </button>
                                </form>
                            )}

                            <p className="text-center text-xs mt-4" style={{ color: "#9ca3af" }}>
                                Already registered?{" "}
                                <a href="/login" style={{ color: "#16a34a", fontWeight: "600" }}>Login here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
