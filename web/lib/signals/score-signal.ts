import { mapSignalLevel } from "@/lib/signals/map-signal-level";
import { SignalResult } from "@/lib/signals/signal.types";

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

type ScoreSignalInput = {
  price: number;
  prevPrice: number;
  rsi: number | null;
  ma20: number | null;
  ma20Prev: number | null;
  ma50: number | null;
  bbUpper: number | null;
  bbLower: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHist: number | null;
  volume: number;
  avgVolume: number;
};

export function scoreSignal(input: ScoreSignalInput): SignalResult {
  const {
    price,
    prevPrice,
    rsi,
    ma20,
    ma20Prev,
    ma50,
    bbUpper,
    bbLower,
    macd,
    macdSignal,
    macdHist,
    volume,
    avgVolume,
  } = input;

  let score = 0;
  let rsiCondition = "데이터 부족";
  let maCondition = "데이터 부족";
  let bbCondition = "데이터 부족";

  if (isFiniteNumber(rsi)) {
    if (rsi <= 25) {
      score += 3;
      rsiCondition = "과매도 강함 (강한 매수 우위)";
    } else if (rsi <= 35) {
      score += 2;
      rsiCondition = "과매도 구간 (매수 우위)";
    } else if (rsi < 45) {
      score += 1;
      rsiCondition = "중립 하단 (약한 매수 우위)";
    } else if (rsi < 55) {
      rsiCondition = "중립";
    } else if (rsi < 65) {
      score -= 1;
      rsiCondition = "중립 상단 (약한 매도 우위)";
    } else if (rsi < 75) {
      score -= 2;
      rsiCondition = "과매수 구간 (매도 우위)";
    } else {
      score -= 3;
      rsiCondition = "과매수 강함 (강한 매도 우위)";
    }
  }

  const maSignals: string[] = [];

  if (isFiniteNumber(price) && isFiniteNumber(ma20)) {
    if (price >= ma20) {
      score += 1;
      maSignals.push("가격 > MA20");
    } else {
      score -= 1;
      maSignals.push("가격 < MA20");
    }
  }

  if (isFiniteNumber(ma20) && isFiniteNumber(ma50)) {
    if (ma20 >= ma50) {
      score += 1.5;
      maSignals.push("MA20 > MA50");
    } else {
      score -= 1.5;
      maSignals.push("MA20 < MA50");
    }
  }

  if (isFiniteNumber(ma20) && isFiniteNumber(ma20Prev)) {
    if (ma20 >= ma20Prev) {
      score += 0.5;
      maSignals.push("MA20 상승");
    } else {
      score -= 0.5;
      maSignals.push("MA20 하락");
    }
  }

  if (isFiniteNumber(macd) && isFiniteNumber(macdSignal)) {
    if (macd >= macdSignal) {
      score += 1;
      maSignals.push("MACD 강세");
    } else {
      score -= 1;
      maSignals.push("MACD 약세");
    }
  }

  if (isFiniteNumber(macdHist)) {
    score += macdHist >= 0 ? 0.7 : -0.7;
  }

  maCondition = maSignals.length > 0 ? maSignals.join(" · ") : "데이터 부족";

  if (isFiniteNumber(price) && isFiniteNumber(bbUpper) && isFiniteNumber(bbLower) && bbUpper > bbLower) {
    const position = (price - bbLower) / (bbUpper - bbLower);
    const positionPercent = Math.max(0, Math.min(100, position * 100));

    if (price < bbLower) {
      score += 2;
      bbCondition = "하단 이탈 (반등 후보)";
    } else if (price > bbUpper) {
      score -= 2;
      bbCondition = "상단 이탈 (조정 후보)";
    } else if (position <= 0.25) {
      score += 0.8;
      bbCondition = `밴드 하단부 (${positionPercent.toFixed(0)}%)`;
    } else if (position >= 0.75) {
      score -= 0.8;
      bbCondition = `밴드 상단부 (${positionPercent.toFixed(0)}%)`;
    } else {
      bbCondition = `밴드 중립 (${positionPercent.toFixed(0)}%)`;
    }
  }

  if (isFiniteNumber(price) && isFiniteNumber(prevPrice)) {
    score += price >= prevPrice ? 0.5 : -0.5;
  }

  if (isFiniteNumber(volume) && isFiniteNumber(avgVolume) && avgVolume > 0) {
    const ratio = volume / avgVolume;
    if (ratio >= 1.4) {
      score += isFiniteNumber(prevPrice) && price >= prevPrice ? 0.8 : -0.8;
    }
  }

  const finalScore = Math.max(-10, Math.min(10, Number(score.toFixed(1))));
  const level = mapSignalLevel(finalScore);

  if (finalScore >= 5) {
    return {
      text: "강력 매수",
      score: finalScore,
      level,
      rsiCondition,
      maCondition,
      bbCondition,
      tone: "buyStrong",
      className: "border-emerald-400 bg-emerald-500/20 text-emerald-300",
    };
  }

  if (finalScore >= 2) {
    return {
      text: "매수",
      score: finalScore,
      level,
      rsiCondition,
      maCondition,
      bbCondition,
      tone: "buy",
      className: "border-lime-400 bg-lime-500/20 text-lime-300",
    };
  }

  if (finalScore > -2) {
    return {
      text: "보유",
      score: finalScore,
      level,
      rsiCondition,
      maCondition,
      bbCondition,
      tone: "hold",
      className: "border-slate-400 bg-slate-500/20 text-slate-100",
    };
  }

  if (finalScore > -5) {
    return {
      text: "매도",
      score: finalScore,
      level,
      rsiCondition,
      maCondition,
      bbCondition,
      tone: "sell",
      className: "border-orange-400 bg-orange-500/20 text-orange-300",
    };
  }

  return {
    text: "강력 매도",
    score: finalScore,
    level,
    rsiCondition,
    maCondition,
    bbCondition,
    tone: "sellStrong",
    className: "border-rose-400 bg-rose-500/20 text-rose-300",
  };
}
