import { describe, expect, it } from "vitest";
import { mapSignalLevel } from "../lib/signals/map-signal-level";
import { scoreSignal } from "../lib/signals/score-signal";

describe("mapSignalLevel", () => {
  it("maps score bands to five levels", () => {
    expect(mapSignalLevel(6)).toBe(5);
    expect(mapSignalLevel(3)).toBe(4);
    expect(mapSignalLevel(0)).toBe(3);
    expect(mapSignalLevel(-3)).toBe(2);
    expect(mapSignalLevel(-8)).toBe(1);
  });
});

describe("scoreSignal", () => {
  it("returns buy tone for strong oversold recovery setup", () => {
    const result = scoreSignal({
      price: 101,
      prevPrice: 99,
      rsi: 24,
      ma20: 98,
      ma20Prev: 97,
      ma50: 95,
      bbUpper: 108,
      bbLower: 96,
      macd: 1.2,
      macdSignal: 0.7,
      macdHist: 0.5,
      volume: 180,
      avgVolume: 100,
    });

    expect(result.level).toBeGreaterThanOrEqual(4);
    expect(result.text === "매수" || result.text === "강력 매수").toBe(true);
  });

  it("returns sell tone for extended overheated setup", () => {
    const result = scoreSignal({
      price: 92,
      prevPrice: 96,
      rsi: 82,
      ma20: 98,
      ma20Prev: 99,
      ma50: 102,
      bbUpper: 91,
      bbLower: 80,
      macd: -1.4,
      macdSignal: -0.8,
      macdHist: -0.6,
      volume: 200,
      avgVolume: 100,
    });

    expect(result.level).toBeLessThanOrEqual(2);
    expect(result.text === "매도" || result.text === "강력 매도").toBe(true);
  });
});
