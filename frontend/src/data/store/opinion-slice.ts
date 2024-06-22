import { StateCreator } from "zustand";
import { Opinion } from "~/schema/Opinion";

type OpinionState = {
  opinions: Map<Opinion["opinionId"], Opinion>;
};

type OpinionAction = {
  setTrendingOpinions: (opinions: Opinion[]) => void;
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
      {
        opinions: new Map(
          opinions.map((opinion) => [
            opinion.opinionId,
            { ...opinion, isTrending: true },
          ]),
        ),
      },
      false,
      "OpinionAction/setTrendingOpinions",
    ),
});
