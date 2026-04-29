export function ema(values: number[], period: number) {
  const output = Array<number | null>(values.length).fill(null);
  if (values.length === 0) {
    return output;
  }

  const multiplier = 2 / (period + 1);
  let previous = values[0];
  output[0] = previous;

  for (let index = 1; index < values.length; index += 1) {
    previous = values[index] * multiplier + previous * (1 - multiplier);
    output[index] = previous;
  }

  return output;
}
