export function sma(values: number[], period: number) {
  const output = Array<number | null>(values.length).fill(null);
  let sum = 0;

  for (let index = 0; index < values.length; index += 1) {
    sum += values[index];
    if (index >= period) {
      sum -= values[index - period];
    }
    if (index >= period - 1) {
      output[index] = sum / period;
    }
  }

  return output;
}
