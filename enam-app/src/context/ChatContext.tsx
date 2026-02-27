"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ChatMessage {
    id: string;
    role: "user" | "bot";
    text: string;
    timestamp: Date;
}

interface ChatContextType {
    messages: ChatMessage[];
    isOpen: boolean;
    isTyping: boolean;
    sendMessage: (text: string) => void;
    toggleChat: () => void;
    clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

const AGRI_RESPONSES: Record<string, string> = {
    greeting: "Jai Kisan! 🌾 Welcome to AgriTrade. How can I help you today?",
    credit: "AgriCredit (AC) is our digital token pegged to MSP prices. 1 AC ≈ ₹22.75 (wheat MSP per kg). You earn credits by trading, listing, and verifying other farmers!",
    msp: "MSP (Minimum Support Price) is set by Govt. of India. Wheat MSP 2024-25: ₹2,275/quintal. Your AgriCredits are pegged to this, so values stay stable.",
    trade: "To trade: 1) List your surplus crop with image. 2) Community verifies your listing. 3) Nearby buyers bid. 4) Agree on price in AgriCredits. 5) Escrow locks funds. 6) Complete handover → Credits released!",
    listing: "To list produce: Go to Marketplace → Post Surplus → Upload crop image → Enter quantity and grade → Submit. You earn 5 AC just for listing!",
    wallet: "Your AgriCredit wallet shows balance, transaction history, and pending escrow amounts. Credits expire with 2% monthly decay after 12 months of inactivity.",
    fee: "Platform fee is just 1% of trade value. If you trade 1000 AC, you pay 10 AC fee. Farmers keep 990 AC. Fee goes to platform maintenance.",
    escrow: "Escrow protects both parties! Buyer's credits are locked when they bid. Seller confirms handover → Credits auto-release. If dispute: we mediate within 48 hours.",
    geo: "AgriTrade uses geographic constraints. You can only trade with farmers within 20km radius. This ensures practical delivery and builds local trust networks.",
    verify: "Community verification: 2 nearby verified farmers must endorse your listing. This prevents fake listings. You earn 15 AC for each farmer you verify!",
    register: "Registration is free! Enter your mobile number, verify OTP, then fill your village details. You get 50 AC welcome bonus immediately!",
    default: "I'm your AgriTrade assistant. Ask me about: AgriCredits, MSP prices, how to trade, listing produce, wallet, fees, escrow, or registration. Type your question!",
};

function getBotResponse(userText: string): string {
    const lower = userText.toLowerCase();
    if (lower.match(/hello|hi|namaste|नमस्ते|jai kisan/)) return AGRI_RESPONSES.greeting;
    if (lower.match(/credit|ac |agri.?credit/)) return AGRI_RESPONSES.credit;
    if (lower.match(/msp|minimum support|support price/)) return AGRI_RESPONSES.msp;
    if (lower.match(/trade|buy|sell|बेच|खरीद/)) return AGRI_RESPONSES.trade;
    if (lower.match(/list|surplus|post|upload/)) return AGRI_RESPONSES.listing;
    if (lower.match(/wallet|balance|coins|tokens/)) return AGRI_RESPONSES.wallet;
    if (lower.match(/fee|charge|commission|cost/)) return AGRI_RESPONSES.fee;
    if (lower.match(/escrow|lock|secure/)) return AGRI_RESPONSES.escrow;
    if (lower.match(/geo|location|nearby|distance|radius/)) return AGRI_RESPONSES.geo;
    if (lower.match(/verify|verification|fake|trust/)) return AGRI_RESPONSES.verify;
    if (lower.match(/register|sign up|new|join/)) return AGRI_RESPONSES.register;
    return AGRI_RESPONSES.default;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "init",
            role: "bot",
            text: AGRI_RESPONSES.greeting,
            timestamp: new Date(),
        },
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = useCallback((text: string) => {
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);
        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: getBotResponse(text),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    }, []);

    const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);
    const clearChat = useCallback(() => {
        setMessages([{ id: "init", role: "bot", text: AGRI_RESPONSES.greeting, timestamp: new Date() }]);
    }, []);

    return (
        <ChatContext.Provider value={{ messages, isOpen, isTyping, sendMessage, toggleChat, clearChat }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within ChatProvider");
    return ctx;
}
