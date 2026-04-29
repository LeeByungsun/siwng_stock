type TickerSummaryProps = {
  ticker: string;
  currentPrice: string;
  priceChange: string;
  priceChangeTone: string;
};

export function TickerSummary({ ticker, currentPrice, priceChange, priceChangeTone }: TickerSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-700/40 bg-[var(--surface)] p-4 shadow-lg">
      <h2 className="text-sm text-slate-400">Ticker Info</h2>
      <p className="mt-3 text-3xl font-bold">{ticker}</p>
      <p className="mt-1 text-2xl">{currentPrice}</p>
      <p className={`mt-1 text-sm ${priceChangeTone}`}>{priceChange}</p>
    </section>
  );
}
