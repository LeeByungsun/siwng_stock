import { ema } from "@/lib/indicators/ema";

export function calculateMacd(closes: number[]) {
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macd = closes.map((_, index) => (ema12[index] ?? 0) - (ema26[index] ?? 0));
  const signal = ema(macd, 9);
  const hist = macd.map((value, index) => value - (signal[index] ?? 0));

  return { macd, signal, hist };
}
