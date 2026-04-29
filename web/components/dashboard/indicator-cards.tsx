type IndicatorCardsProps = {
  rsiValueLabel: string;
  macdValueLabel: string;
  macdHistLabel: string;
  avgVolumeLabel: string;
};

function IndicatorCard({ title, value, subValue, tooltip }: { title: string; value: string; subValue?: string; tooltip: string }) {
  return (
    <article className="cursor-help rounded-2xl border border-slate-700/40 bg-[var(--surface)] p-4 shadow-lg" title={tooltip}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
      {subValue ? <p className="mt-1 text-sm text-slate-400">{subValue}</p> : null}
    </article>
  );
}

export function IndicatorCards({ rsiValueLabel, macdValueLabel, macdHistLabel, avgVolumeLabel }: IndicatorCardsProps) {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <IndicatorCard
        title="RSI (14)"
        value={rsiValueLabel}
        tooltip="RSI(상대강도지수): 최근 가격 상승/하락 강도를 0~100으로 표시합니다. 일반적으로 70 이상 과매수, 30 이하 과매도로 해석합니다."
      />
      <IndicatorCard
        title="MACD (12,26,9)"
        value={macdValueLabel}
        subValue={macdHistLabel}
        tooltip="MACD: 단기/장기 EMA 차이로 추세와 모멘텀을 봅니다. MACD가 Signal 위면 상대적 강세, 아래면 약세로 해석합니다. Histo는 그 차이입니다."
      />
      <IndicatorCard
        title="Volume (20)"
        value={avgVolumeLabel}
        tooltip="Volume(20봉 평균): 최근 20개 캔들의 평균 거래량입니다. 거래가 활발한지(유동성/관심도) 판단하는 데 사용합니다."
      />
    </section>
  );
}
