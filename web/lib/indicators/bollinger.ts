import { sma } from "@/lib/indicators/sma";

export function calculateBollingerBands(closes: number[], period = 20, multiplier = 2) {
  const basis = sma(closes, period);
  const upper = Array<number | null>(closes.length).fill(null);
  const lower = Array<number | null>(closes.length).fill(null);

  for (let index = period - 1; index < closes.length; index += 1) {
    const center = basis[index];
    if (center == null) {
      continue;
    }

    let varianceSum = 0;
    for (let cursor = index - period + 1; cursor <= index; cursor += 1) {
      varianceSum += (closes[cursor] - center) ** 2;
    }

    const deviation = Math.sqrt(varianceSum / period);
    upper[index] = center + deviation * multiplier;
    lower[index] = center - deviation * multiplier;
  }

  return { basis, upper, lower };
}
