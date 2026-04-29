import { SignalMeter } from "@/components/dashboard/signal-meter";
import { SignalResult } from "@/lib/signals/signal.types";

type SignalCardProps = {
  signal: SignalResult | null;
};

export function SignalCard({ signal }: SignalCardProps) {
  const safeSignal = signal ?? {
    text: "보유",
    score: 0,
    level: 3 as const,
    rsiCondition: "-",
    maCondition: "-",
    bbCondition: "-",
    tone: "hold" as const,
    className: "border-slate-600 bg-slate-800 text-slate-100",
  };

  return (
    <section className="rounded-2xl border border-slate-700/40 bg-[var(--surface)] p-4 shadow-lg">
      <h2 className="text-sm text-slate-400">실시간 매매 시그널</h2>
      <div className={`mt-3 rounded-xl border p-4 text-center ${safeSignal.className}`}>
        <p className="text-3xl font-extrabold">{safeSignal.text}</p>
        <p className="mt-1 text-sm text-slate-200">점수: {safeSignal.score > 0 ? "+" : ""}{safeSignal.score.toFixed(1)}</p>
      </div>

      <SignalMeter level={safeSignal.level} score={safeSignal.score} label={safeSignal.text} />

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 xl:grid-cols-1">
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
          <p className="text-slate-400">RSI 판단</p>
          <p className="mt-1 font-semibold">{safeSignal.rsiCondition}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
          <p className="text-slate-400">MA 추세</p>
          <p className="mt-1 font-semibold">{safeSignal.maCondition}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2">
          <p className="text-slate-400">볼린저 위치</p>
          <p className="mt-1 font-semibold">{safeSignal.bbCondition}</p>
        </div>
      </div>
    </section>
  );
}
