import type { OpinionOption } from "./OpinionOption";
import type { ContestResult } from "./ContestResult";
import type { ContestType } from "./ContestType";

export type Opinion = {
  type: ContestType.Opinion;
  opinionId: string;
  title: string;
  endDate: string;
  filmId: string;
  votes: Vote[];
  userVote?: UserVote;
  result?: ContestResult<OpinionOption>;

  // For client-side state management
  isTrending?: boolean;
  isActive?: boolean;

  // Hack to show opinions in certain order in contests page. This data
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
