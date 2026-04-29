import { Candle } from "@/lib/market/market.types";

export function calculateAverageVolume(data: Candle[], period = 20) {
  const start = Math.max(0, data.length - period);
  let sum = 0;
  let count = 0;

  for (let index = start; index < data.length; index += 1) {
    const volume = Number(data[index].volume);
    if (Number.isFinite(volume) && volume > 0) {
      sum += volume;
      count += 1;
    }
  }

  return count ? sum / count : 0;
}
