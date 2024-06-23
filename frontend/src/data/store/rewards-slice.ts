import type { StateCreator } from "zustand";
import type { Reward } from "~/schema/Reward";

type RewardState = {
  rewards: Reward[];
};

type RewardAction = {
  setRewards: (rewards: Reward[]) => void;
};

export type RewardSlice = RewardState & RewardAction;

export const createRewardSlice: StateCreator<
  RewardSlice,
  [["zustand/devtools", never]],
  [],
  RewardSlice
> = (set) => ({
  rewards: [],
  setRewards: (rewards) =>
    set(
      {
        rewards,
      },
      false,
      "RewardAction/setRewards",
    ),
});
