import type { UserSlice } from "../user-slice";

export const userMaxOpinionCoinsSelector = (state: UserSlice): number => state.maxOpinionCoins;