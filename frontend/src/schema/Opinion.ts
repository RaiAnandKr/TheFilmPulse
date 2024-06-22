import type { OpinionOption } from "./OpinionOption";
import type { PulseResult } from "./PulseResult";
import type { PulseType } from "./PulseType";

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
  isTrending?: boolean; // To be shown in home page. For client-side state-management.
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
