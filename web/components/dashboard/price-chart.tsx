"use client";

import { useEffect, useRef } from "react";
import type { IChartApi, ISeriesApi, CandlestickData, HistogramData, LineData, UTCTimestamp } from "lightweight-charts";
import { Candle } from "@/lib/market/market.types";

function toLineData(data: Candle[], values: Array<number | null>) {
  return data.flatMap((item, index) => {
    const value = values[index];
    if (value == null || Number.isNaN(value)) {
      return [];
    }

    return [{ time: item.time as UTCTimestamp, value: Number(value.toFixed(4)) } satisfies LineData];
  });
}

type PriceChartProps = {
  data: Candle[];
  ma20: Array<number | null>;
  ma50: Array<number | null>;
  bbUpper: Array<number | null>;
  bbLower: Array<number | null>;
};

export function PriceChart({ data, ma20, ma50, bbUpper, bbLower }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const ma20SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ma50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbUpperSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbLowerSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    let mounted = true;
    let detachResize: (() => void) | undefined;

    async function buildChart() {
      if (!containerRef.current) {
        return;
      }

      const lightweightCharts = await import("lightweight-charts");
      if (!mounted || !containerRef.current) {
        return;
      }

      const chart = lightweightCharts.createChart(containerRef.current, {
        layout: {
          background: { color: "#1e222d" },
          textColor: "#b8c0cc",
        },
        grid: {
          vertLines: { color: "rgba(184,192,204,0.08)" },
          horzLines: { color: "rgba(184,192,204,0.08)" },
        },
        rightPriceScale: {
          borderColor: "rgba(184,192,204,0.25)",
        },
        timeScale: {
          borderColor: "rgba(184,192,204,0.25)",
          timeVisible: true,
        },
        crosshair: {
          mode: lightweightCharts.CrosshairMode.Normal,
        },
        width: containerRef.current.clientWidth,
        height: 560,
      });

      chartRef.current = chart;
      candleSeriesRef.current = chart.addSeries(lightweightCharts.CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });
      ma20SeriesRef.current = chart.addSeries(lightweightCharts.LineSeries, {
        color: "#f59e0b",
        lineWidth: 2,
        priceLineVisible: false,
      });
      ma50SeriesRef.current = chart.addSeries(lightweightCharts.LineSeries, {
        color: "#8b5cf6",
        lineWidth: 2,
        priceLineVisible: false,
      });
      bbUpperSeriesRef.current = chart.addSeries(lightweightCharts.LineSeries, {
        color: "rgba(16,185,129,0.9)",
        lineWidth: 1,
        priceLineVisible: false,
      });
      bbLowerSeriesRef.current = chart.addSeries(lightweightCharts.LineSeries, {
        color: "rgba(16,185,129,0.9)",
        lineWidth: 1,
        priceLineVisible: false,
      });
      volumeSeriesRef.current = chart.addSeries(lightweightCharts.HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "",
        color: "rgba(148,163,184,0.5)",
      });

      volumeSeriesRef.current.priceScale().applyOptions({
        scaleMargins: { top: 0.78, bottom: 0 },
      });

      const resize = () => {
        if (!containerRef.current || !chartRef.current) {
          return;
        }
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth, height: 560 });
      };

      window.addEventListener("resize", resize, { passive: true });
      detachResize = () => window.removeEventListener("resize", resize);
      resize();
    }

    void buildChart();

    return () => {
      mounted = false;
      detachResize?.();
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current || data.length === 0) {
      return;
    }

    candleSeriesRef.current.setData(
      data.map((item) => ({
        time: item.time as UTCTimestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      })) satisfies CandlestickData<UTCTimestamp>[],
    );

    volumeSeriesRef.current?.setData(
      data.map((item) => ({
        time: item.time as UTCTimestamp,
        value: item.volume,
        color: item.close >= item.open ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)",
      })) satisfies HistogramData<UTCTimestamp>[],
    );

    ma20SeriesRef.current?.setData(toLineData(data, ma20));
    ma50SeriesRef.current?.setData(toLineData(data, ma50));
    bbUpperSeriesRef.current?.setData(toLineData(data, bbUpper));
    bbLowerSeriesRef.current?.setData(toLineData(data, bbLower));
    chartRef.current.timeScale().fitContent();
  }, [bbLower, bbUpper, data, ma20, ma50]);

  return (
    <section className="rounded-2xl border border-slate-700/40 bg-[var(--surface)] p-3 shadow-lg md:p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center rounded bg-cyan-500/20 px-2 py-1 text-cyan-300">Candlestick</span>
        <span className="inline-flex items-center rounded bg-amber-500/20 px-2 py-1 text-amber-300">MA20</span>
        <span className="inline-flex items-center rounded bg-violet-500/20 px-2 py-1 text-violet-300">MA50</span>
        <span className="inline-flex items-center rounded bg-emerald-500/20 px-2 py-1 text-emerald-300">Bollinger</span>
        <span className="inline-flex items-center rounded bg-slate-500/20 px-2 py-1 text-slate-200">Volume</span>
      </div>
      <div ref={containerRef} className="h-[560px] w-full" />
    </section>
  );
}
