import React, { createContext, useState } from "react";
import { REWARDS, getMaxRedeemableCoins } from "~/constants/mocks";

const useRewardState = () => {
  const userRedeemableCoins = getMaxRedeemableCoins();

  return useState(userRedeemableCoins);
};

export const RewardContext = createContext<ReturnType<typeof useRewardState>>([
  0,
  () => {},
]);

export const RewardProvider = ({ children }: { children: React.ReactNode }) => {
  const [rewardPointer, setRewardPointer] = useRewardState();

  return (
    <RewardContext.Provider value={[rewardPointer, setRewardPointer]}>
      {children}
    </RewardContext.Provider>
  );
};
