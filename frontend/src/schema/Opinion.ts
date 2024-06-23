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
  result?: PulseResult<OpinionOption>;

  // For client-side state management
  isTrending?: boolean;
  isActive?: boolean;
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
