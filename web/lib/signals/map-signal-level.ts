export function mapSignalLevel(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 5) return 5;
  if (score >= 2) return 4;
  if (score > -2) return 3;
  if (score > -5) return 2;
  return 1;
}
