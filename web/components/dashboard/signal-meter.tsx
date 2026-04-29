import { SIGNAL_STAGE_LABELS } from "@/lib/constants/ui";

type SignalMeterProps = {
  level: 1 | 2 | 3 | 4 | 5;
  score: number;
  label: string;
};

const STAGE_CLASSNAMES = [
  "border-rose-400/30 bg-rose-500/25",
  "border-orange-400/30 bg-orange-500/25",
  "border-slate-300/30 bg-slate-400/25",
  "border-lime-400/30 bg-lime-500/25",
  "border-emerald-400/30 bg-emerald-500/25",
] as const;

export function SignalMeter({ level, score, label }: SignalMeterProps) {
  const confidence = Math.max(0, Math.min(1, Math.abs(score) / 10));

  return (
    <div className="mt-3">
      <div className="grid h-14 grid-cols-5 items-end gap-1">
        {STAGE_CLASSNAMES.map((className, index) => {
          const barLevel = (index + 1) as 1 | 2 | 3 | 4 | 5;
          const distance = Math.abs(barLevel - level);
          const active = distance === 0;
          const neighbor = distance === 1;
          const height = active ? 70 + confidence * 30 : neighbor ? 45 + confidence * 20 : 35;
          const opacity = active ? 1 : neighbor ? 0.72 : 0.35;

          return (
            <div
              key={barLevel}
              className={`rounded-md border transition-all duration-300 ${className}`}
              style={{
                height: `${height}%`,
                opacity,
                filter: active ? "saturate(1.35) brightness(1.15)" : "none",
                boxShadow: active ? "0 0 12px rgba(148,163,184,0.35)" : "none",
                transform: active ? "translateY(-2px)" : "none",
              }}
            />
          );
        })}
      </div>
      <div className="mt-1 grid grid-cols-5 gap-1 text-center text-[10px] text-slate-400">
        {SIGNAL_STAGE_LABELS.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-300">현재 레벨: {level}/5 ({label})</p>
    </div>
  );
}
