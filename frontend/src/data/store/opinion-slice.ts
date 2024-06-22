import { StateCreator } from "zustand";
import { Opinion } from "~/schema/Opinion";
import { mergeArrayToMap } from "~/utilities/mergeArrayToMap";

type OpinionState = {
  opinions: Map<Opinion["opinionId"], Opinion>;
};

type OpinionAction = {
  setTrendingOpinions: (opinions: Opinion[]) => void;
  setActiveOpinions: (opinions: Opinion[]) => void;
};

export type OpinionSlice = OpinionState & OpinionAction;

export const createOpinionSlice: StateCreator<
  OpinionSlice,
  [["zustand/devtools", never]],
  [],
  OpinionSlice
> = (set) => ({
  opinions: new Map(),
  setTrendingOpinions: (opinions) =>
    set(
      (state) => ({
        opinions: mergeArrayToMap(state.opinions, opinions, "opinionId", {
          isTrending: true,
        }),
      }),
      false,
      "OpinionAction/setTrendingOpinions",
    ),
  setActiveOpinions: (opinions) =>
    set(
      (state) => ({
        opinions: mergeArrayToMap(state.opinions, opinions, "opinionId", {
          isActive: true,
        }),
      }),
      false,
      "OpinionAction/setActiveOpinions",
    ),
});
