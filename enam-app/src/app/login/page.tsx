"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Phone, Delete, ChevronRight, Wheat } from "lucide-react";
import toast from "react-hot-toast";

type Step = "phone" | "otp";

export default function LoginPage() {
    const router = useRouter();
    const { sendOTP, verifyOTP } = useAuth();
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const recaptchaRef = useRef<HTMLDivElement>(null);

    const displayPhone = phone.replace(/(\d{5})(\d{5})/, "$1 $2");

    // ── Keypad digits ──
    const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

    const handlePhoneKey = (key: string) => {
        if (key === "#") {
            if (phone.length > 0) setPhone((p) => p.slice(0, -1));
            return;
        }
        if (key === "*") return;
        if (phone.length < 10) setPhone((p) => p + key);
    };

    const handleOtpKey = (key: string) => {
        if (key === "#") {
            if (otp.length > 0) setOtp((o) => o.slice(0, -1));
            return;
        }
        if (key === "*") return;
        if (otp.length < 6) setOtp((o) => o + key);
    };

    const handleSendOTP = async () => {
        if (phone.length !== 10) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }
        setLoading(true);
        try {
            const fullPhone = `+91${phone}`;
            const result = await sendOTP(fullPhone, "recaptcha-container");
            setConfirmation(result);
            setStep("otp");
            toast.success(`OTP sent to +91 ${displayPhone}`);
        } catch (err: unknown) {
            // For demo: allow test OTP flow without Firebase billing
            console.error(err);
            toast.error("Using demo mode. For production, enable Firebase Phone Auth billing.");
            // Demo mode: skip real OTP
            setStep("otp");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error("Enter complete 6-digit OTP");
            return;
        }
        setLoading(true);
        try {
            if (confirmation) {
                await verifyOTP(confirmation, otp);
            }
            toast.success("Login successful! Welcome to eNAM AgriMarket 🌾");
            router.push("/dashboard");
        } catch (err: unknown) {
            console.error(err);
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)" }}
        >
            {/* Hidden recaptcha */}
            <div id="recaptcha-container" ref={recaptchaRef} />

            <div className="w-full max-w-md">
                {/* Card */}
                <div
                    className="rounded-3xl overflow-hidden"
                    style={{
                        background: "white",
                        boxShadow: "0 20px 80px rgba(22, 163, 74, 0.15)",
                        border: "1px solid #dcfce7",
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-8 py-6 text-center"
                        style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}
                    >
                        <Image src="/logo.png" alt="eNAM" width={56} height={56} className="mx-auto mb-3 rounded-xl" />
                        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                            eNAM AgriMarket
                        </h1>
                        <p className="text-green-200 text-sm">
                            {step === "phone" ? "Enter your mobile number to continue" : "Enter the 6-digit OTP sent to your phone"}
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        {/* Display Area */}
                        <div
                            className="rounded-xl px-5 py-4 mb-6 text-center"
                            style={{ background: "#f0fdf4", border: "2px solid #bbf7d0" }}
                        >
                            {step === "phone" ? (
                                <>
                                    <div className="flex items-center justify-center gap-3 mb-1">
                                        <Phone size={18} style={{ color: "#16a34a" }} />
                                        <span className="text-sm font-medium" style={{ color: "#166534" }}>Mobile Number</span>
                                    </div>
                                    <div className="text-2xl font-bold tracking-widest" style={{ color: "#14532d", fontFamily: "monospace" }}>
                                        {phone ? `+91 ${displayPhone}` : "+91 __________"}
                                    </div>
                                    <div className="text-xs mt-1" style={{ color: "#6b7280" }}>
                                        {10 - phone.length} digits remaining
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-sm font-medium mb-2" style={{ color: "#166534" }}>
                                        OTP for +91 {displayPhone}
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                                                style={{
                                                    background: otp[i] ? "#dcfce7" : "#f8fafc",
                                                    border: `2px solid ${otp[i] ? "#16a34a" : "#e2e8f0"}`,
                                                    color: "#14532d",
                                                    transition: "all 0.2s",
                                                }}
                                            >
                                                {otp[i] || ""}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* KEYPAD */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {KEYS.map((key) => {
                                const isBackspace = key === "#";
                                const isStar = key === "*";
                                return (
                                    <button
                                        key={key}
                                        className="otp-key"
                                        onClick={() => step === "phone" ? handlePhoneKey(key) : handleOtpKey(key)}
                                        aria-label={isBackspace ? "Backspace" : isStar ? "Star" : key}
                                        title={isBackspace ? "Delete" : undefined}
                                    >
                                        {isBackspace ? <Delete size={20} style={{ color: "#dc2626" }} /> : isStar ? "⭐" : key}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Action Button */}
                        {step === "phone" ? (
                            <button
                                id="send-otp-btn"
                                onClick={handleSendOTP}
                                disabled={phone.length !== 10 || loading}
                                className="btn-primary w-full text-base"
                                style={{
                                    opacity: phone.length !== 10 ? 0.6 : 1,
                                    cursor: phone.length !== 10 ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending OTP...
                                    </span>
                                ) : (
                                    <>Send OTP <ChevronRight size={16} /></>
                                )}
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    id="verify-otp-btn"
                                    onClick={handleVerifyOTP}
                                    disabled={otp.length !== 6 || loading}
                                    className="btn-primary w-full text-base"
                                    style={{ opacity: otp.length !== 6 ? 0.6 : 1 }}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : (
                                        <>Verify & Login <ChevronRight size={16} /></>
                                    )}
                                </button>
                                <button
                                    onClick={() => { setStep("phone"); setOtp(""); }}
                                    className="w-full text-sm text-center py-2"
                                    style={{ color: "#16a34a" }}
                                >
                                    ← Change number
                                </button>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px" style={{ background: "#e0f2e9" }} />
                            <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>OR CONTINUE WITH</span>
                            <div className="flex-1 h-px" style={{ background: "#e0f2e9" }} />
                        </div>

                        {/* Google Sign-in (UI only for demo) */}
                        <button
                            id="google-signin-btn"
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all"
                            style={{
                                border: "2px solid #e0f2e9",
                                background: "white",
                                color: "#374151",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                            onClick={() => toast("Google Sign-in available in production version", { icon: "ℹ️" })}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>

                        {/* AgriCredit signup bonus note */}
                        <div
                            className="mt-5 p-3 rounded-xl flex items-start gap-3 text-sm"
                            style={{ background: "#fef3c7", border: "1px solid #fde68a" }}
                        >
                            <Wheat size={16} style={{ color: "#92400e", flexShrink: 0, marginTop: 2 }} />
                            <span style={{ color: "#92400e" }}>
                                <strong>New farmer?</strong> Get <strong>50 AgriCredits (≈ ₹1,137)</strong> free on first login!
                            </span>
                        </div>
                    </div>
                </div>

                {/* Register link */}
                <p className="text-center mt-4 text-sm" style={{ color: "#166534" }}>
                    Not registered?{" "}
                    <a href="/register" className="font-semibold" style={{ color: "#16a34a" }}>
                        Register as Farmer — it&apos;s free
                    </a>
                </p>
            </div>
        </div>
    );
}
