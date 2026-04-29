export type SignalTone = "buyStrong" | "buy" | "hold" | "sell" | "sellStrong";

export type SignalResult = {
  text: string;
  score: number;
  level: 1 | 2 | 3 | 4 | 5;
  rsiCondition: string;
  maCondition: string;
  bbCondition: string;
  tone: SignalTone;
  className: string;
};
