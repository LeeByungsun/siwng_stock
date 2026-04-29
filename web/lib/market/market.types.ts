export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type MarketApiResponse = {
  ticker: string;
  source: string;
  fallback: boolean;
  fetchedAt: string;
  error?: string;
  data: Candle[];
};
