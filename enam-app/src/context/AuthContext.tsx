"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { CREDIT_REWARDS } from "@/lib/agriCredit";

interface UserProfile {
    uid: string;
    phone: string;
    name: string;
    village: string;
    state: string;
    lat?: number;
    lng?: number;
    agriCredits: number;
    lastTransactionDate: Date;
    role: "farmer" | "trader" | "admin";
    verified: boolean;
    verificationCount: number;
    trustScore: number;
    totalTrades: number;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    sendOTP: (phone: string, recaptchaContainerId: string) => Promise<ConfirmationResult>;
    verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (uid: string) => {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const data = snap.data();
            setProfile({
                ...data,
                uid,
                lastTransactionDate: data.lastTransactionDate?.toDate?.() || new Date(),
                createdAt: data.createdAt?.toDate?.() || new Date(),
            } as UserProfile);
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                await fetchProfile(u.uid);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    const sendOTP = async (phone: string, recaptchaContainerId: string) => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
            size: "invisible",
        });
        const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
        return confirmation;
    };

    const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
        const result = await confirmationResult.confirm(otp);
        const u = result.user;
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            // New user - create profile with signup bonus
            await setDoc(ref, {
                phone: u.phoneNumber,
                name: "",
                village: "",
                state: "",
                agriCredits: CREDIT_REWARDS.referral_new_farmer,
                lastTransactionDate: serverTimestamp(),
                role: "farmer",
                verified: false,
                verificationCount: 0,
                trustScore: 50,
                totalTrades: 0,
                createdAt: serverTimestamp(),
            });
        }
        await fetchProfile(u.uid);
    };

    const logout = async () => {
        await signOut(auth);
        setProfile(null);
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.uid);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, sendOTP, verifyOTP, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
