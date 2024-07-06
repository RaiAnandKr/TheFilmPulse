import type { UserSlice } from "../user-slice";

export const userTotalCoinsSelector = (state: UserSlice) =>
  state.userCoins.reduce((acc, userCoin) => acc + userCoin.coins, 0);
