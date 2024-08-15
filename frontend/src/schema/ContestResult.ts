export interface ContestResult<TValue> {
  type: ContestResultType;
  coinsUsed?: number;
  coinsResult: number;
  finalValue: TValue;
  resultSource?: string;
  resultSourceLink?: string;
  ranking?: number;
}

export enum ContestResultType {
  None = "None",
  Won = "Won",
  Lost = "Lost",
}
