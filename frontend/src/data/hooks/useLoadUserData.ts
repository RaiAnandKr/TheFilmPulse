import { useMainStore } from "../contexts/store-context";
import { useLoadData } from "./useLoadData";
import { getUser } from "~/service/apiUtils";
import type { UserSlice } from "../store/user-slice";
import { CoinType } from "~/schema/CoinType";

export const useLoadUserData = <T>(selector: (state: UserSlice) => T): T => {
  const userInfo = useMainStore(selector);
  const setUserState = useMainStore((state) => state.setUser);

  useLoadData("getUser", getUser, (user) => {
    if (!user) {
      return;
    }

    setUserState({
      userId: user.id?.toString(),
      phone: user.phoneNumber,
      handle: user.userhandle,
      isUserLoggedIn: true,
      userCoins: [
        {
          type: CoinType.Earned,
          coins: user.earnedCoins,
          isRedeemable: true,
        },
        {
          type: CoinType.Bonus,
          coins: user.bonusCoins,
          isRedeemable: false,
        },
      ],
    });
  });

  return userInfo;
};
