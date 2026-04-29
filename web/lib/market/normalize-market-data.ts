import { MIN_CANDLES } from "@/lib/constants/market";
import { Candle } from "@/lib/market/market.types";

export function normalizeYahooChartPayload(raw: unknown): Candle[] {
  const result = (raw as { chart?: { result?: Array<Record<string, unknown>>; error?: { description?: string } } })?.chart?.result?.[0];

  if (!result) {
    const detail = (raw as { chart?: { error?: { description?: string } } })?.chart?.error?.description;
    throw new Error(detail || "Yahoo chart result is empty");
  }

  const timestamps = Array.isArray(result.timestamp) ? (result.timestamp as Array<number | null>) : [];
  const quote = Array.isArray((result.indicators as { quote?: unknown[] } | undefined)?.quote)
    ? ((result.indicators as { quote: Array<Record<string, unknown>> }).quote[0] ?? {})
    : {};

  const opens = Array.isArray(quote.open) ? (quote.open as Array<number | null>) : [];
  const highs = Array.isArray(quote.high) ? (quote.high as Array<number | null>) : [];
  const lows = Array.isArray(quote.low) ? (quote.low as Array<number | null>) : [];
  const closes = Array.isArray(quote.close) ? (quote.close as Array<number | null>) : [];
  const volumes = Array.isArray(quote.volume) ? (quote.volume as Array<number | null>) : [];

  const candles: Candle[] = [];

  for (let index = 0; index < timestamps.length; index += 1) {
    const time = timestamps[index];
    const open = opens[index];
    const high = highs[index];
    const low = lows[index];
    const close = closes[index];
    const volume = volumes[index];

    if ([time, open, high, low, close].some((value) => value == null)) {
      continue;
    }

    candles.push({
      time: Number(time),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume || 0),
    });
  }

  candles.sort((left, right) => left.time - right.time);

  if (candles.length < MIN_CANDLES) {
    throw new Error("Not enough candles returned from Yahoo");
  }

  return candles;
}
