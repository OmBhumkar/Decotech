import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { Toaster } from "react-hot-toast";
import Chatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AgriTrade — National Agriculture Market | AgriCredit Exchange",
  description:
    "India's premier digital agricultural marketplace. Trade crops, earn AgriCredits pegged to MSP, and access fair pricing powered by AgriTrade. Supporting 1522+ mandis across 23 states.",
  keywords: "AgriTrade, agriculture market, AgriCredit, MSP, farmer, crop trading, India, mandi",
  authors: [{ name: "Small Farmers Agribusiness Consortium" }],
  openGraph: {
    title: "AgriTrade — Digital Agriculture Exchange",
    description: "Trade agricultural produce, earn AgriCredits pegged to MSP, connect with farmers across India.",
    type: "website",
    locale: "en_IN",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChatProvider>
            <Navbar />
            <main>{children}</main>
            <Chatbot />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#ffffff",
                  color: "#0f2d1a",
                  border: "1px solid #d1e8d5",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 30px rgba(15,45,26,0.10)",
                },
                success: { iconTheme: { primary: "#16a34a", secondary: "white" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "white" } },
              }}
            />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
