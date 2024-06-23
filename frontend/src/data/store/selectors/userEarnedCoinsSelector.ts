import { CoinType } from "~/schema/CoinType";
import type { UserSlice } from "../user-slice";

export const userEarnedCoinsSelector = (state: UserSlice) =>
  state.userCoins.find((userCoin) => userCoin.type === CoinType.Earned)
    ?.coins ?? 0;
