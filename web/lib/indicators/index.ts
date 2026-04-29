import { calculateBollingerBands } from "@/lib/indicators/bollinger";
import { calculateMacd } from "@/lib/indicators/macd";
import { calculateRsi } from "@/lib/indicators/rsi";
import { sma } from "@/lib/indicators/sma";
import { Candle } from "@/lib/market/market.types";

export function computeIndicators(data: Candle[]) {
  const closes = data.map((item) => item.close);

  return {
    ma20: sma(closes, 20),
    ma50: sma(closes, 50),
    rsi: calculateRsi(closes, 14),
    bb: calculateBollingerBands(closes, 20, 2),
    macd: calculateMacd(closes),
  };
}
