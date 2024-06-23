import React, { createContext, useState } from "react";

const useRewardState = () => {
  const initialPointerPosition = 0;
  return useState(initialPointerPosition);
};

export const RewardContext = createContext<ReturnType<typeof useRewardState>>([
  0,
  (val) => {
    val;
  },
]);

export const RewardProvider = ({ children }: { children: React.ReactNode }) => {
  const [rewardPointer, setRewardPointer] = useRewardState();

  return (
    <RewardContext.Provider value={[rewardPointer, setRewardPointer]}>
      {children}
    </RewardContext.Provider>
  );
};
