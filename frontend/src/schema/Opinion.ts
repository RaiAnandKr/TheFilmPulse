import type { OpinionOption } from "./OpinionOption";
import type { PulseResult } from "./PulseResult";
import { PulseType } from "./PulseType";

export type Opinion = {
  type: PulseType.Opinion;
  opinionId: string;
  title: string;
  startDate: string;
  endDate: string;
  filmId: string;
  votes: Vote[];
  userVote?: UserVote;
  filmPosterSrc?: string;
  result?: PulseResult<OpinionOption>;
};

export type Vote = {
  option: OpinionOption;
  participationCount: number;
  coins: number;
};

export type UserVote = {
  selectedOption: OpinionOption;
  coinsUsed: number;
};
