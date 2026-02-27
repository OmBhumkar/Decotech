"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { MessageCircle, X, Send, Bot, RotateCcw } from "lucide-react";

export default function Chatbot() {
    const { messages, isOpen, isTyping, sendMessage, toggleChat, clearChat } = useChat();
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput("");
    };

    const quickReplies = ["AgriCredit kya hai?", "MSP rate batao", "Trade kaise kare?", "Fee kitni hai?"];

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden"
                    style={{
                        boxShadow: "0 20px 60px rgba(22, 163, 74, 0.25)",
                        border: "1px solid #bbf7d0",
                        background: "white",
                        animation: "slideInRight 0.3s ease",
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot size={18} className="text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-white text-sm">AgriBot</div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                                    <span className="text-green-100 text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={clearChat} className="p-1 rounded text-white/70 hover:text-white" title="Clear chat">
                                <RotateCcw size={16} />
                            </button>
                            <button onClick={toggleChat} className="p-1 rounded text-white/70 hover:text-white" title="Close">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-72 overflow-y-auto px-3 py-3 space-y-3" style={{ background: "#f9fafb" }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "bot" && (
                                    <div className="w-7 h-7 rounded-full mr-2 flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}>
                                        <Bot size={14} className="text-white" />
                                    </div>
                                )}
                                <div
                                    className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                                    style={
                                        msg.role === "user"
                                            ? { background: "linear-gradient(135deg, #16a34a, #059669)", color: "white", borderBottomRightRadius: "4px" }
                                            : { background: "white", color: "#14532d", border: "1px solid #dcfce7", borderBottomLeftRadius: "4px" }
                                    }
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}>
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="px-3 py-2 rounded-2xl" style={{ background: "white", border: "1px solid #dcfce7" }}>
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full"
                                                style={{
                                                    background: "#16a34a",
                                                    animation: `bounce-subtle 1s infinite ${i * 0.2}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Replies */}
                    <div className="flex gap-1.5 px-3 py-2 overflow-x-auto" style={{ borderTop: "1px solid #f0fdf4" }}>
                        {quickReplies.map((q) => (
                            <button
                                key={q}
                                onClick={() => sendMessage(q)}
                                className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                                style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2 px-3 py-3" style={{ borderTop: "1px solid #f0fdf4" }}>
                        <input
                            id="chatbot-input"
                            type="text"
                            className="input-field py-2 text-sm"
                            placeholder="Ask about trading, prices..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #16a34a, #059669)", color: "white" }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                id="chatbot-toggle"
                onClick={toggleChat}
                className="fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center animate-pulse-green"
                style={{
                    background: "linear-gradient(135deg, #16a34a, #059669)",
                    boxShadow: "0 4px 20px rgba(22, 163, 74, 0.4)",
                    transition: "transform 0.2s ease",
                }}
                aria-label="Open AgriBot chat"
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <MessageCircle size={24} className="text-white" />
                )}
            </button>
        </>
    );
}
