import { useMainStore } from "../contexts/store-context";
import { useLoadData } from "./useLoadData";
import { getUser } from "~/service/apiUtils";
import { CoinType } from "~/schema/CoinType";

export const useLoadUserData = () => {
  const setUserState = useMainStore((state) => state.setUser);

  return useLoadData("getUser", getUser, (user) => {
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
      maxOpinionCoins: user.maxOpinionCoins,
    });
  });
};
