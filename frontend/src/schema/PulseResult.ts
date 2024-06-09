export interface PulseResult<TValue> {
  type: PulseResultType;
  coinsUsed?: number;
  coinsResult: number;
  finalValue: TValue;
  resultSource?: string;
  resultSourceLink?: string;
}

export enum PulseResultType {
  None = "None",
  Won = "Won",
  Lost = "Lost",
}
