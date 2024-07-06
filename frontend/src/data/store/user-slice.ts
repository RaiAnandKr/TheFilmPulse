import type { StateCreator } from "zustand";
import { CoinType } from "~/schema/CoinType";

type UserState = {
  userId: string | null;
  phone: string | null;
  handle: string | null;
  userCoins: { type: CoinType; coins: number; isRedeemable?: boolean }[];
  isLoggedIn: boolean;
};

type UserAction = {
  setUser: (userState: UserState) => void;
  updateUserCoins: (type: CoinType, deductBy: number) => void;
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
  removeUserState: () =>
    set({ ...initUserState() }, false, "UserAction/removeUser"),
});

const initUserState = () => ({
  userId: null,
  phone: null,
  handle: null,
  isLoggedIn: false,
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
