import {
    collection,
    addDoc,
    updateDoc,
    getDoc,
    getDocs,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    increment,
    runTransaction,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { commodityToAC, calculateFee, CREDIT_REWARDS } from "@/lib/agriCredit";

export interface Listing {
    id: string;
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    commodity: string;
    category: string;
    quantityKg: number;
    qualityGrade: "A" | "B" | "C";
    askingPriceAC: number;
    mspValueAC: number;
    imageUrl: string;
    village: string;
    state: string;
    lat: number;
    lng: number;
    description: string;
    verificationCount: number;
    verified: boolean;
    status: "active" | "in_escrow" | "completed" | "cancelled";
    createdAt: Date;
    expiresAt: Date;
}

export interface Trade {
    id: string;
    listingId: string;
    sellerId: string;
    buyerId: string;
    commodity: string;
    quantityKg: number;
    agreedPriceAC: number;
    platformFeeAC: number;
    sellerReceivesAC: number;
    status: "pending" | "escrow" | "completed" | "disputed";
    escrowLocked: boolean;
    createdAt: Date;
    completedAt?: Date;
}

export interface Message {
    id: string;
    tradeId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
}

// ─── Listings ──────────────────────────────────────────────────────────────

export async function createListing(data: Omit<Listing, "id" | "createdAt" | "expiresAt" | "verificationCount" | "verified" | "status" | "mspValueAC">) {
    const mspValueAC = commodityToAC(data.commodity, data.quantityKg);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const ref = await addDoc(collection(db, "listings"), {
        ...data,
        mspValueAC,
        verificationCount: 0,
        verified: false,
        status: "active",
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
    });

    // Reward farmer for listing
    const userRef = doc(db, "users", data.farmerId);
    await updateDoc(userRef, {
        agriCredits: increment(CREDIT_REWARDS.listing_created),
        lastTransactionDate: serverTimestamp(),
    });

    return ref.id;
}

export async function getListings(filters?: {
    commodity?: string;
    village?: string;
    status?: string;
}) {
    let q = query(
        collection(db, "listings"),
        where("status", "==", filters?.status || "active"),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
        expiresAt: d.data().expiresAt?.toDate?.() || new Date(),
    })) as Listing[];
}

export async function verifyListing(listingId: string, verifierId: string) {
    const listingRef = doc(db, "listings", listingId);
    const verifierRef = doc(db, "users", verifierId);

    await runTransaction(db, async (txn) => {
        const listingSnap = await txn.get(listingRef);
        if (!listingSnap.exists()) throw new Error("Listing not found");
        const currentCount = listingSnap.data().verificationCount || 0;
        const newCount = currentCount + 1;
        txn.update(listingRef, {
            verificationCount: newCount,
            verified: newCount >= 2,
        });
        // Reward the verifier
        txn.update(verifierRef, {
            agriCredits: increment(CREDIT_REWARDS.community_verification),
            lastTransactionDate: serverTimestamp(),
        });
    });
}

// ─── Trades ────────────────────────────────────────────────────────────────

export async function initiateTrade(
    listingId: string,
    buyerId: string,
    agreedPriceAC: number
) {
    const listingRef = doc(db, "listings", listingId);
    const listingSnap = await getDoc(listingRef);
    if (!listingSnap.exists()) throw new Error("Listing not found");
    const listing = listingSnap.data() as Listing;

    const buyerRef = doc(db, "users", buyerId);
    const buyerSnap = await getDoc(buyerRef);
    if (!buyerSnap.exists()) throw new Error("Buyer not found");
    const buyer = buyerSnap.data();

    if ((buyer.agriCredits || 0) < agreedPriceAC) {
        throw new Error("Insufficient AgriCredits");
    }

    const { fee, sellerReceives } = calculateFee(agreedPriceAC);

    const tradeRef = await runTransaction(db, async (txn) => {
        // Deduct from buyer (escrow)
        txn.update(buyerRef, {
            agriCredits: increment(-agreedPriceAC),
            lastTransactionDate: serverTimestamp(),
        });

        // Lock listing
        txn.update(listingRef, { status: "in_escrow" });

        // Create trade
        const ref = doc(collection(db, "trades"));
        txn.set(ref, {
            listingId,
            sellerId: listing.farmerId,
            buyerId,
            commodity: listing.commodity,
            quantityKg: listing.quantityKg,
            agreedPriceAC,
            platformFeeAC: fee,
            sellerReceivesAC: sellerReceives,
            status: "escrow",
            escrowLocked: true,
            createdAt: serverTimestamp(),
        });

        return ref;
    });

    return tradeRef.id;
}

export async function completeTrade(tradeId: string) {
    const tradeRef = doc(db, "trades", tradeId);
    const tradeSnap = await getDoc(tradeRef);
    if (!tradeSnap.exists()) throw new Error("Trade not found");
    const trade = tradeSnap.data() as Trade;

    const sellerRef = doc(db, "users", trade.sellerId);
    const platformRef = doc(db, "system", "platform_wallet");
    const listingRef = doc(db, "listings", trade.listingId);

    await runTransaction(db, async (txn) => {
        // Pay seller
        txn.update(sellerRef, {
            agriCredits: increment(trade.sellerReceivesAC + CREDIT_REWARDS.trade_completed_seller),
            lastTransactionDate: serverTimestamp(),
            totalTrades: increment(1),
        });

        // Accumulate platform fee
        txn.set(platformRef, { balance: increment(trade.platformFeeAC) }, { merge: true });

        // Mark trade and listing done
        txn.update(tradeRef, {
            status: "completed",
            escrowLocked: false,
            completedAt: serverTimestamp(),
        });
        txn.update(listingRef, { status: "completed" });
    });
}

export async function sendTradeMessage(
    tradeId: string,
    senderId: string,
    senderName: string,
    text: string
) {
    await addDoc(collection(db, "trades", tradeId, "messages"), {
        senderId,
        senderName,
        text,
        timestamp: serverTimestamp(),
    });
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export async function getMarketAnalytics() {
    const snap = await getDocs(
        query(collection(db, "listings"), where("status", "==", "active"))
    );

    const commodityCount: Record<string, number> = {};
    let totalVolume = 0;

    snap.docs.forEach((d) => {
        const data = d.data();
        const c = data.commodity || "unknown";
        commodityCount[c] = (commodityCount[c] || 0) + 1;
        totalVolume += data.quantityKg || 0;
    });

    const sorted = Object.entries(commodityCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    return { commodityCount: sorted, totalVolume, totalListings: snap.size };
}
