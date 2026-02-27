import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { Toaster } from "react-hot-toast";
import Chatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "eNAM AgriMarket — National Agriculture Market | AgriCredit Exchange",
  description:
    "India's premier digital agricultural marketplace. Trade crops, earn AgriCredits pegged to MSP, and access fair pricing powered by eNAM. Supporting 1522+ mandis across 23 states.",
  keywords: "eNAM, agriculture market, AgriCredit, MSP, farmer, crop trading, India, mandi",
  authors: [{ name: "Small Farmers Agribusiness Consortium" }],
  openGraph: {
    title: "eNAM AgriMarket — Digital Agriculture Exchange",
    description: "Trade agricultural produce, earn AgriCredits pegged to MSP, connect with farmers across India.",
    type: "website",
    locale: "en_IN",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
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
                  background: "#f0fdf4",
                  color: "#14532d",
                  border: "1px solid #bbf7d0",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.9rem",
                },
                success: { iconTheme: { primary: "#16a34a", secondary: "white" } },
                error: { iconTheme: { primary: "#dc2626", secondary: "white" } },
              }}
            />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
