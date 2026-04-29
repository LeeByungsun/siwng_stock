export function calculateRsi(closes: number[], period = 14) {
  const rsi = Array<number | null>(closes.length).fill(null);
  if (closes.length <= period) {
    return rsi;
  }

  let gainSum = 0;
  let lossSum = 0;

  for (let index = 1; index <= period; index += 1) {
    const diff = closes[index] - closes[index - 1];
    if (diff >= 0) {
      gainSum += diff;
    } else {
      lossSum += -diff;
    }
  }

  let averageGain = gainSum / period;
  let averageLoss = lossSum / period;
  rsi[period] = averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);

  for (let index = period + 1; index < closes.length; index += 1) {
    const diff = closes[index] - closes[index - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    averageGain = ((averageGain * (period - 1)) + gain) / period;
    averageLoss = ((averageLoss * (period - 1)) + loss) / period;
    rsi[index] = averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);
  }

  return rsi;
}
