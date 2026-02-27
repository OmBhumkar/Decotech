/**
 * AgriCredit System
 * ==================
 * AgriCredit (AC) is a digital credit token pegged to MSP (Minimum Support Price)
 * established by the Government of India.
 *
 * PEGGING FORMULA:
 *   1 AC = 1 kg of wheat at MSP
 *   Current MSP Wheat = ₹2,275/quintal = ₹22.75/kg
 *   Therefore: 1 AC ≈ ₹22.75 (2024-25 MSP)
 *
 * WHY MSP PEGGING?
 * - Prevents hyperinflation of credits
 * - Farmers understand value in familiar terms
 * - Government MSP acts as a floor price guarantee
 * - Credit value adjusts annually with MSP revision
 *
 * CREDIT REWARDS PER TRADE (FEASIBLE):
 * - Listing a crop:                 +5 AC (encourages participation)
 * - Completing a trade (seller):    +10 AC bonus (loyalty incentive)
 * - First trade of the month:       +25 AC (engagement boost)
 * - Community verification badge:   +15 AC per farmer you verify
 * - Quality grade A produce:        +20 AC (quality incentive)
 * - Referral (new farmer joins):    +50 AC
 *
 * PLATFORM FEE: 1% of trade value deducted and sent to platform_wallet
 *
 * CREDIT EXPIRY:
 * - Credits inactive for 12 months: 2% monthly decay kicks in
 * - This prevents hoarding and keeps economy liquid
 *
 * ESCROW MECHANISM:
 * - Buyer's credits locked in escrow upon bid confirmation
 * - Released to seller only after trade completion confirmation
 * - 1% fee deducted at release time
 */

export const MSP_RATES: Record<string, number> = {
    wheat: 2275,      // ₹ per quintal (2024-25)
    rice: 2300,
    maize: 2090,
    soybean: 4892,
    cotton: 7121,
    sugarcane: 340,
    onion: 800,
    tomato: 600,
    potato: 700,
    mustard: 5950,
    groundnut: 6783,
    sunflower: 7280,
    jowar: 3371,
    bajra: 2625,
    barley: 1735,
    lentil: 6425,
    chickpea: 5440,
};

// Base peg: 1 AC = ₹22.75 (wheat MSP per kg)
export const AC_TO_INR = 22.75;
export const INR_TO_AC = 1 / AC_TO_INR;
export const PLATFORM_FEE_PCT = 0.01; // 1%

/**
 * Convert kg of a commodity to AgriCredits using MSP
 */
export function commodityToAC(commodity: string, quantityKg: number): number {
    const mspPerQtl = MSP_RATES[commodity.toLowerCase()] || MSP_RATES.wheat;
    const mspPerKg = mspPerQtl / 100;
    const inrValue = mspPerKg * quantityKg;
    return Math.floor(inrValue * INR_TO_AC);
}

/**
 * Convert AgriCredits to INR
 */
export function acToINR(ac: number): number {
    return ac * AC_TO_INR;
}

/**
 * Calculate platform fee on a trade
 */
export function calculateFee(tradeAmountAC: number): {
    fee: number;
    sellerReceives: number;
} {
    const fee = Math.ceil(tradeAmountAC * PLATFORM_FEE_PCT);
    return { fee, sellerReceives: tradeAmountAC - fee };
}

/**
 * Check if credits have expired (12 months inactivity)
 */
export function checkCreditDecay(
    lastTransactionDate: Date,
    currentBalance: number
): { decayed: boolean; newBalance: number; monthsInactive: number } {
    const now = new Date();
    const diffMs = now.getTime() - lastTransactionDate.getTime();
    const monthsInactive = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

    if (monthsInactive >= 12) {
        const decayMonths = monthsInactive - 11;
        const decayFactor = Math.pow(0.98, decayMonths); // 2% per month
        const newBalance = Math.floor(currentBalance * decayFactor);
        return { decayed: true, newBalance, monthsInactive };
    }
    return { decayed: false, newBalance: currentBalance, monthsInactive };
}

export const CREDIT_REWARDS = {
    listing_created: 5,
    trade_completed_seller: 10,
    first_trade_this_month: 25,
    community_verification: 15,
    quality_grade_a: 20,
    referral_new_farmer: 50,
};

export const COMMODITY_CATEGORIES = [
    {
        name: "Food Grains",
        items: ["Wheat", "Rice", "Maize", "Jowar", "Bajra", "Barley"],
        icon: "🌾",
    },
    {
        name: "Oilseeds",
        items: ["Soybean", "Mustard", "Groundnut", "Sunflower"],
        icon: "🫙",
    },
    {
        name: "Pulses",
        items: ["Lentil", "Chickpea"],
        icon: "🌱",
    },
    {
        name: "Cash Crops",
        items: ["Cotton", "Sugarcane"],
        icon: "🌿",
    },
    {
        name: "Vegetables",
        items: ["Onion", "Tomato", "Potato"],
        icon: "🥦",
    },
];
