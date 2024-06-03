export type Opinion = {
  opinionId: string;
  title: string;
  startDate: string;
  endDate: string;
  filmId: string;
  votes: Vote[];
  userVote?: UserVote;
  filmPosterSrc?: string;
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

export enum OpinionOption {
  Yes = "Yes",
  No = "No",
}
