import { StateCreator } from "zustand";
import { Opinion } from "~/schema/Opinion";
import { mergeArrayToMap } from "~/utilities/mergeArrayToMap";

type OpinionState = {
  opinions: Map<Opinion["opinionId"], Opinion>;
};

type OpinionAction = {
  updateOpinions: <A extends string | { type: string }>(
    actionName: A,
    opinions: Opinion[],
    addMoreProperties?: Partial<Opinion>,
  ) => void;
  setTrendingOpinions: (opinions: Opinion[]) => void;
  setActiveOpinions: (opinions: Opinion[]) => void;
  setFilmOpinions: (filmId: Opinion["filmId"], opinions: Opinion[]) => void;
};

export type OpinionSlice = OpinionState & OpinionAction;

export const createOpinionSlice: StateCreator<
  OpinionSlice,
  [["zustand/devtools", never]],
  [],
  OpinionSlice
> = (set, get) => ({
  opinions: new Map(),
  updateOpinions: (actionName, opinions, addMoreProperties) =>
    set(
      (state) => ({
        opinions: mergeArrayToMap(
          state.opinions,
          opinions,
          "opinionId",
          addMoreProperties,
        ),
      }),
      false,
      actionName,
    ),
  setTrendingOpinions: (opinions) =>
    get().updateOpinions("OpinionAction/setTrendingOpinions", opinions, {
      isTrending: true,
    }),
  setActiveOpinions: (opinions) =>
    get().updateOpinions("OpinionAction/setActiveOpinions", opinions, {
      isActive: true,
    }),
  setFilmOpinions: (filmId, opinions) =>
    get().updateOpinions(
      { type: "OpinionAction/setFilmOpinions", filmId },
      opinions,
    ),
});
