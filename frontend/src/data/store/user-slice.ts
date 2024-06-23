import type { StateCreator } from "zustand";
import type { CoinType } from "~/schema/CoinType";

type UserState = {
  userId: string;
  phone: string;
  handle: string;
  userCoins: { type: CoinType; coins: number; isRedeemable?: boolean }[];
};

type UserAction = {
  setUserCoins: (userCoins: UserState["userCoins"]) => void;
};

export type UserSlice = UserState & UserAction;

export const createUserSlice: StateCreator<
  UserSlice,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => ({
  userId: "",
  phone: "",
  handle: "",
  userCoins: [],
  userPredictions: new Map(),
  userOpinions: new Map(),
  setUserCoins: (userCoins) =>
    set(
      {
        userCoins,
      },
      false,
      "UserAction/setUserCoins",
    ),
});
