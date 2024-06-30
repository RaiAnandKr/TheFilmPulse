import type { StateCreator } from "zustand";
import { CoinType } from "~/schema/CoinType";

type UserState = {
  userId: string;
  phone: string;
  handle: string;
  userCoins: { type: CoinType; coins: number; isRedeemable?: boolean }[];
};

type UserAction = {
  setUserCoins: (userCoins: UserState["userCoins"]) => void;
  updateUserCoins: (type: CoinType, deductBy: number) => void;
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
  setUserCoins: (userCoins) =>
    set(
      {
        userCoins,
      },
      false,
      "UserAction/setUserCoins",
    ),
  updateUserCoins: (type, deductBy) =>
    set(
      (state) => {
        const updatedCoins = [...state.userCoins];
        const targetCoinCategory = updatedCoins.find(
          (userCoin) => userCoin.type === type,
        );
        if (targetCoinCategory) {
          targetCoinCategory.coins -= deductBy;
        }

        return {
          userCoins: updatedCoins,
        };
      },
      false,
      "UserAction/updateUserCoins",
    ),
});
