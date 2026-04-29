import { DEFAULT_INTERVAL, DEFAULT_RANGE } from "@/lib/constants/market";
import { generateMockMarketData } from "@/lib/market/mock-market-data";
import { normalizeYahooChartPayload } from "@/lib/market/normalize-market-data";
import { MarketApiResponse } from "@/lib/market/market.types";

async function fetchJsonWithFallback(url: string) {
  const endpoints = [
    url,
    `https://cors.isomorphic-git.org/${url}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];

  let lastError = "";

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return (await response.json()) as unknown;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "unknown error";
    }
  }

  throw new Error(`Yahoo Finance fetch failed (${lastError || "unknown error"})`);
}

export async function fetchMarketData(tickerRaw: string): Promise<MarketApiResponse> {
  const ticker = tickerRaw.trim().toUpperCase();
  const fetchedAt = new Date().toISOString();

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${DEFAULT_INTERVAL}&range=${DEFAULT_RANGE}&includePrePost=false&events=div%2Csplits`;

  try {
    const raw = await fetchJsonWithFallback(url);
    const data = normalizeYahooChartPayload(raw);

    return {
      ticker,
      source: "Yahoo Finance",
      fallback: false,
      fetchedAt,
      data,
    };
  } catch (error) {
    return {
      ticker,
      source: "Mock Fallback",
      fallback: true,
      fetchedAt,
      error: error instanceof Error ? error.message : "Unknown fetch error",
      data: generateMockMarketData(ticker),
    };
  }
}
