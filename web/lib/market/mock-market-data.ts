import { Candle } from "@/lib/market/market.types";

const DAY_SEC = 24 * 60 * 60;

function hashTicker(ticker: string) {
  let hash = 2166136261;
  for (let index = 0; index < ticker.length; index += 1) {
    hash ^= ticker.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function nextRandom() {
    let tick = (seed += 0x6d2b79f5);
    tick = Math.imul(tick ^ (tick >>> 15), tick | 1);
    tick ^= tick + Math.imul(tick ^ (tick >>> 7), tick | 61);
    return ((tick ^ (tick >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMockMarketData(ticker: string, points = 220): Candle[] {
  const seed = hashTicker(ticker);
  const random = mulberry32(seed);
  const nowSec = Math.floor(Date.now() / 1000);
  const base = 30 + (seed % 270);
  const trend = ((seed % 200) - 100) / 25000;
  const volatility = 0.009 + (seed % 5) * 0.0025;
  const cycleA = 0.014 + (seed % 3) * 0.003;
  const cycleB = 0.007 + (seed % 7) * 0.001;

  let close = base;
  const candles: Candle[] = [];

  for (let index = points; index >= 1; index -= 1) {
    const time = nowSec - index * DAY_SEC;
    const seasonal = Math.sin((points - index) / 11) * cycleA + Math.cos((points - index) / 17) * cycleB;
    const noise = (random() - 0.5) * volatility;
    const drift = trend + seasonal * 0.08 + noise;

    const open = close;
    close = Math.max(2, open * (1 + drift));
    const high = Math.max(open, close) * (1 + random() * 0.017);
    const low = Math.min(open, close) * (1 - random() * 0.017);
    const volume = Math.round((450000 + random() * 3500000) * (1 + Math.abs(drift) * 12));

    candles.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }

  return candles;
}
