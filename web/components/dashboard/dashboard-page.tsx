"use client";

import { useEffect, useRef } from "react";
import { DisclaimerBanner } from "@/components/dashboard/disclaimer-banner";
import { HeaderSearch } from "@/components/dashboard/header-search";
import { IndicatorCards } from "@/components/dashboard/indicator-cards";
import { PriceChart } from "@/components/dashboard/price-chart";
import { SignalCard } from "@/components/dashboard/signal-card";
import { TickerSummary } from "@/components/dashboard/ticker-summary";
import { DEFAULT_TICKER } from "@/lib/constants/market";
import { useTickerDashboard } from "@/hooks/use-ticker-dashboard";

export function DashboardPage() {
  const didInitRef = useRef(false);
  const { tickerInput, setTickerInput, currentTicker, statusMessage, loading, dashboard, loadTicker } = useTickerDashboard();

  useEffect(() => {
    if (didInitRef.current) {
      return;
    }

    didInitRef.current = true;
    void loadTicker(DEFAULT_TICKER);
  }, [loadTicker]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-6">
      <HeaderSearch
        title={dashboard.title}
        lastUpdateLabel={dashboard.lastUpdateLabel}
        tickerInput={tickerInput}
        loading={loading}
        statusMessage={statusMessage}
        onTickerInputChange={setTickerInput}
        onSubmit={() => {
          void loadTicker(tickerInput);
        }}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-4">
          <TickerSummary
            ticker={currentTicker}
            currentPrice={dashboard.currentPrice}
            priceChange={dashboard.priceChange}
            priceChangeTone={dashboard.priceChangeTone}
          />
          <SignalCard signal={dashboard.signal} />
        </aside>

        <div className="xl:col-span-8">
          <PriceChart
            data={dashboard.candles}
            ma20={dashboard.indicators?.ma20 ?? []}
            ma50={dashboard.indicators?.ma50 ?? []}
            bbUpper={dashboard.indicators?.bb.upper ?? []}
            bbLower={dashboard.indicators?.bb.lower ?? []}
          />
        </div>
      </div>

      <DisclaimerBanner />

      <IndicatorCards
        rsiValueLabel={dashboard.rsiValueLabel}
        macdValueLabel={dashboard.macdValueLabel}
        macdHistLabel={dashboard.macdHistLabel}
        avgVolumeLabel={dashboard.avgVolumeLabel}
      />
    </main>
  );
}
