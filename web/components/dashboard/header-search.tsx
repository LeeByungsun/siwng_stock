import { FetchStatus } from "@/components/dashboard/fetch-status";

type HeaderSearchProps = {
  title: string;
  lastUpdateLabel: string;
  tickerInput: string;
  loading: boolean;
  statusMessage: string;
  onTickerInputChange: (value: string) => void;
  onSubmit: () => void;
};

export function HeaderSearch({
  title,
  lastUpdateLabel,
  tickerInput,
  loading,
  statusMessage,
  onTickerInputChange,
  onSubmit,
}: HeaderSearchProps) {
  return (
    <section className="rounded-2xl border border-slate-700/40 bg-[var(--surface)] p-4 shadow-lg md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Realtime Stock Signal Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{lastUpdateLabel}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <input
            value={tickerInput}
            onChange={(event) => onTickerInputChange(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSubmit();
              }
            }}
            placeholder="예: AAPL, MSFT, TSLA"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 outline-none ring-0 transition focus:border-cyan-500 sm:w-56"
            aria-label="티커 입력"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            조회
          </button>
        </div>
      </div>
      <FetchStatus message={statusMessage} />
    </section>
  );
}
