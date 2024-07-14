import type { StateCreator } from "zustand";
import { CoinType } from "~/schema/CoinType";

type UserState = {
  userId: string | null;
  phone: string | null;
  handle: string | null;
  userCoins: { type: CoinType; coins: number; isRedeemable?: boolean }[];
  isUserLoggedIn: boolean;
  isNewUser?: boolean;
  maxOpinionCoins: number;
};

type UserAction = {
  setUser: (userState: Partial<UserState>) => void;
  deductUserCoins: (deductBy: number, onlyEarned?: boolean) => void;
  removeUserState: () => void;
};

export type UserSlice = UserState & UserAction;

export const createUserSlice: StateCreator<
  UserSlice,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => ({
  ...initUserState(),
  setUser: (userState) =>
    set(
      {
        ...userState,
      },
      false,
      "UserAction/setUserState",
    ),
  // By default, we will always deduct from user's bonus coins and then deduct from
  // user's earned coins. This will be the case with user participating in any contest
  // which requires coins.
  // However, for certain cases (like claiming a coupon), we would want to always deduct
  // from the earned coins and hence for that case "onlyEarned" will be set to true.
  deductUserCoins: (deductBy, onlyEarned = false) =>
    set(
      (state) => {
        const updatedCoins = [...state.userCoins];
        const bonusCoinCategory = updatedCoins.find(
          (userCoin) => userCoin.type === CoinType.Bonus,
        );
        const earnedCoinCategory = updatedCoins.find(
          (userCoin) => userCoin.type === CoinType.Earned,
        );

        if (bonusCoinCategory && earnedCoinCategory) {
          let remainingToDeduct = deductBy;

          if (onlyEarned) {
            // Deduct only from Earned coins
            earnedCoinCategory.coins -= remainingToDeduct;
          } else {
            // Deduct from Bonus coins first
            if (bonusCoinCategory.coins >= remainingToDeduct) {
              bonusCoinCategory.coins -= remainingToDeduct;
              remainingToDeduct = 0;
            } else {
              remainingToDeduct -= bonusCoinCategory.coins;
              bonusCoinCategory.coins = 0;
            }

            // Deduct remaining from Earned coins
            if (remainingToDeduct > 0) {
              earnedCoinCategory.coins -= remainingToDeduct;
            }
          }
        }

        // TODO: We shouldn't really be doing this calculation in the frontend code.
        // We already have the backend APIs which requires coins to be deducted, returning
        // the updated coins value for a user and hence we can simply rely on them
        // for our state management.
        // Update max_opinion_coins
        const newBonusCoins = bonusCoinCategory?.coins ?? 0;
        const newEarnedCoins = earnedCoinCategory?.coins ?? 0;
        const sumCoins = newBonusCoins + newEarnedCoins;
        const newMaxOpinionCoins = sumCoins > 6
          ? Math.ceil(0.4 * sumCoins)
          : sumCoins;

        return {
          userCoins: updatedCoins,
          maxOpinionCoins: newMaxOpinionCoins,
        };
      },
      false,
      "UserAction/deductUserCoins",
    ),
  removeUserState: () =>
    set({ ...initUserState() }, false, "UserAction/removeUser"),
});

const initUserState = () => ({
  userId: null,
  phone: null,
  handle: null,
  isUserLoggedIn: false,
  userCoins: [
    {
      type: CoinType.Earned,
      coins: 0,
      isRedeemable: true,
    },
    {
      type: CoinType.Bonus,
      coins: 0,
      isRedeemable: false,
    },
  ],
  maxOpinionCoins: 0,
});
