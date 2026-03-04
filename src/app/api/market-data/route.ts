import { NextResponse } from "next/server";
import { getMarketData, getStaticMarketData } from "@/lib/calculations/marketData";

export async function GET() {
  try {
    const marketData = await getMarketData();
    return NextResponse.json(marketData);
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return NextResponse.json(getStaticMarketData());
  }
}
