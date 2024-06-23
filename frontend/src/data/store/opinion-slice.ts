import type { StateCreator } from "zustand";
import type { Opinion, UserVote } from "~/schema/Opinion";
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
  addUserOpinion: (opinionId: Opinion["opinionId"], userVote: UserVote) => void;
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
      typeof actionName === "string"
        ? `OpinionAction/${actionName}`
        : {
            ...(actionName as object),
            type: `OpinionAction/${actionName.type}`,
          },
    ),
  setTrendingOpinions: (opinions) =>
    get().updateOpinions("setTrendingOpinions", opinions, {
      isTrending: true,
    }),
  setActiveOpinions: (opinions) =>
    get().updateOpinions("setActiveOpinions", opinions, {
      isActive: true,
    }),
  setFilmOpinions: (filmId, opinions) =>
    get().updateOpinions({ type: "setFilmOpinions", filmId }, opinions),
  addUserOpinion: (opinionId, userVote) => {
    const opinion = get().opinions.get(opinionId);
    get().updateOpinions(
      { type: "addUserOpinion", opinionId },
      opinion ? [opinion] : [],
      {
        userVote,
      },
    );
  },
});
