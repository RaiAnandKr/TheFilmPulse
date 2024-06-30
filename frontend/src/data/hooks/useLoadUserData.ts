import { useMainStore } from "../contexts/store-context";
import { useLoadData } from "./useLoadData";
import { getUserCoins } from "~/service/apiUtils";
import type { UserSlice } from "../store/user-slice";

export const useLoadUserData = <T>(selector: (state: UserSlice) => T): T => {
  const userInfo = useMainStore(selector);
  const setUserCoins = useMainStore((state) => state.setUserCoins);

  useLoadData("getUserCoins", getUserCoins, setUserCoins);

  return userInfo;
};
