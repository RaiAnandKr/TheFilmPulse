export interface PulseResult<TValue> {
  type: PulseResultType;
  coinsUsed?: number;
  coinsResult: number;
  finalValue: TValue;
  resultSource?: string;
  resultSourceLink?: string;
  ranking?: number;
}

export enum PulseResultType {
  None = "None",
  Won = "Won",
  Lost = "Lost",
}
