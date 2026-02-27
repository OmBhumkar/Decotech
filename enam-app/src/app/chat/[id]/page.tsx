"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChatRedirectPage() {
    const params = useParams();
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0fdf4" }}>
            <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: "#14532d" }}>Chat with Farmer</h1>
                <p className="mb-4" style={{ color: "#4b7c5c" }}>Listing ID: {params.id}</p>
                <Link href={`/trade/${params.id}`} className="btn-primary">
                    Open Trade & Chat Interface
                </Link>
            </div>
        </div>
    );
}
