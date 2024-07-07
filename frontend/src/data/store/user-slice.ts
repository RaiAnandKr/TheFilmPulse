import type { StateCreator } from "zustand";
import { CoinType } from "~/schema/CoinType";

type UserState = {
  userId: string | null;
  phone: string | null;
  handle: string | null;
  userCoins: { type: CoinType; coins: number; isRedeemable?: boolean }[];
  isUserLoggedIn: boolean;
  isNewUser?: boolean;
};

type UserAction = {
  setUser: (userState: Partial<UserState>) => void;
  updateUserCoins: (deductBy: number, onlyEarned?: boolean) => void;
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
  updateUserCoins: (deductBy, onlyEarned = false) =>
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

        return {
          userCoins: updatedCoins,
        };
      },
      false,
      "UserAction/updateUserCoins",
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
});
