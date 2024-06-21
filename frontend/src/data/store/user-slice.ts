import { StateCreator } from "zustand";
import type { CoinType } from "~/schema/CoinType";
import type { Prediction } from "~/schema/Prediction";
import type { Opinion, UserVote } from "~/schema/Opinion";

type UserState = {
  userId: string;
  phone: string;
  handle: string;
  coinInfo: { type: CoinType; coins: number }[];
  userPredictions: Map<Prediction["predictionId"], { prediction: number }>;
  userOpinions: Map<Opinion["opinionId"], { userVote: UserVote }>;
};

type UserAction = {};

export type UserSlice = UserState & UserAction;

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
) => ({
  userId: "",
  phone: "",
  handle: "",
  coinInfo: [],
  userPredictions: new Map(),
  userOpinions: new Map(),
});
