"use client";

import { useCallback, useMemo, useState } from "react";
import { AUTO_REFRESH_MS, DEFAULT_TICKER, MIN_CANDLES } from "@/lib/constants/market";
import { formatKoreanDateTime } from "@/lib/format/date";
import { formatCompactNumber } from "@/lib/format/number";
import { formatPrice } from "@/lib/format/price";
import { computeIndicators } from "@/lib/indicators";
import { Candle, MarketApiResponse } from "@/lib/market/market.types";
import { calculateAverageVolume } from "@/lib/indicators/volume";
import { scoreSignal } from "@/lib/signals/score-signal";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";

type DashboardState = "idle" | "loading" | "success" | "fallback" | "error";

type LoadTickerOptions = {
  silent?: boolean;
};

export function useTickerDashboard() {
  const [tickerInput, setTickerInput] = useState(DEFAULT_TICKER);
  const [currentTicker, setCurrentTicker] = useState(DEFAULT_TICKER);
  const [payload, setPayload] = useState<MarketApiResponse | null>(null);
  const [status, setStatus] = useState<DashboardState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTicker = useCallback(async (tickerRaw: string, options: LoadTickerOptions = {}) => {
    const ticker = tickerRaw.trim().toUpperCase();
    if (!ticker || loading) {
      return;
    }

    if (!options.silent) {
      setStatus("loading");
      setStatusMessage(`${ticker} 데이터 조회 중...`);
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/market/${encodeURIComponent(ticker)}`, { cache: "no-store" });
      const nextPayload = (await response.json()) as MarketApiResponse;

      if (!response.ok) {
        throw new Error(nextPayload.error || "데이터를 가져오지 못했습니다.");
      }

      if (!nextPayload.data || nextPayload.data.length < MIN_CANDLES) {
        throw new Error("차트 데이터가 부족합니다.");
      }

      setCurrentTicker(ticker);
      setTickerInput(ticker);
      setPayload(nextPayload);
      setStatus(nextPayload.fallback ? "fallback" : "success");
      setStatusMessage(
        nextPayload.fallback
          ? `${ticker} 조회됨 (${nextPayload.source}) - Yahoo 실패: ${nextPayload.error}`
          : `${ticker} 조회됨 (${nextPayload.source})`,
      );
    } catch (error) {
      setStatus("error");
      setStatusMessage(`오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useAutoRefresh(() => {
    void loadTicker(currentTicker, { silent: true });
  }, AUTO_REFRESH_MS, true);

  const dashboard = useMemo(() => {
    const data = payload?.data ?? [];
    const fetchedAt = payload?.fetchedAt;

    if (data.length === 0) {
      return {
        candles: [] as Candle[],
        title: `${currentTicker} · $0.00`,
        currentPrice: "$0.00",
        priceChange: "0.00 (0.00%)",
        priceChangeTone: "text-slate-400",
        lastUpdateLabel: "마지막 업데이트: -",
        avgVolumeLabel: "-",
        rsiValueLabel: "-",
        macdValueLabel: "-",
        macdHistLabel: "Signal/Histo: -",
        signal: null,
        indicators: null,
      };
    }

    const indicators = computeIndicators(data);
    const last = data[data.length - 1];
    const previous = data[data.length - 2] ?? last;
    const index = data.length - 1;
    const delta = last.close - previous.close;
    const percentage = previous.close ? (delta / previous.close) * 100 : 0;
    const averageVolume = calculateAverageVolume(data, 20);

    const signal = scoreSignal({
      price: last.close,
      prevPrice: previous.close,
      rsi: indicators.rsi[index],
      ma20: indicators.ma20[index],
      ma20Prev: indicators.ma20[Math.max(0, index - 1)],
      ma50: indicators.ma50[index],
      bbUpper: indicators.bb.upper[index],
      bbLower: indicators.bb.lower[index],
      macd: indicators.macd.macd[index],
      macdSignal: indicators.macd.signal[index],
      macdHist: indicators.macd.hist[index],
      volume: last.volume,
      avgVolume: averageVolume,
    });

    return {
      candles: data,
      title: `${currentTicker} · ${formatPrice(last.close)}`,
      currentPrice: formatPrice(last.close),
      priceChange: `${delta >= 0 ? "+" : ""}${delta.toFixed(2)} (${percentage.toFixed(2)}%)`,
      priceChangeTone: delta >= 0 ? "text-emerald-400" : "text-rose-400",
      lastUpdateLabel: `마지막 업데이트: ${fetchedAt ? formatKoreanDateTime(fetchedAt) : "-"}`,
      avgVolumeLabel: formatCompactNumber(averageVolume || 0),
      rsiValueLabel: indicators.rsi[index] != null ? indicators.rsi[index].toFixed(2) : "-",
      macdValueLabel: indicators.macd.macd[index] != null ? indicators.macd.macd[index].toFixed(4) : "-",
      macdHistLabel:
        indicators.macd.signal[index] != null && indicators.macd.hist[index] != null
          ? `Signal: ${indicators.macd.signal[index]?.toFixed(4)} | Histo: ${indicators.macd.hist[index]?.toFixed(4)}`
          : "Signal/Histo: -",
      signal,
      indicators,
    };
  }, [currentTicker, payload]);

  return {
    tickerInput,
    setTickerInput,
    currentTicker,
    payload,
    status,
    statusMessage,
    loading,
    dashboard,
    loadTicker,
  };
}
