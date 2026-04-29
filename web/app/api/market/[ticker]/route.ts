import { NextResponse } from "next/server";
import { fetchMarketData } from "@/lib/market/fetch-market-data";

export async function GET(_: Request, context: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await context.params;

  if (!ticker?.trim()) {
    return NextResponse.json(
      {
        ticker: "",
        source: "",
        fallback: false,
        fetchedAt: new Date().toISOString(),
        error: "티커가 비어 있습니다.",
        data: [],
      },
      { status: 400 },
    );
  }

  const payload = await fetchMarketData(ticker);
  return NextResponse.json(payload, { status: 200 });
}
