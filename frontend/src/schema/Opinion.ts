import type { OpinionOption } from "./OpinionOption";
import type { PulseResult } from "./PulseResult";
import type { PulseType } from "./PulseType";

export type Opinion = {
  type: PulseType.Opinion;
  opinionId: string;
  title: string;
  endDate: string;
  filmId: string;
  votes: Vote[];
  userVote?: UserVote;
  result?: PulseResult<OpinionOption>;

  // For client-side state management
  isTrending?: boolean;
  isActive?: boolean;

  // Hack to show opinions in certain order in pulse page. This data
  // is directly fed from backend response and we return manipulated user_count
  // (different than "yes_count + no_count") for certain opinions to show
  // few opinions on top.
  participationCount: number;
};

export type Vote = {
  option: OpinionOption;
  participationCount: number;
  coins: number;
};

export type UserVote = {
  selectedOption?: OpinionOption;
  coinsUsed: number;
};
