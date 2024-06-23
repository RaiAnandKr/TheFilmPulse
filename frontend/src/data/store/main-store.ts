import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createUserSlice, type UserSlice } from "./user-slice";
import {
  createPredictionSlice,
  type PredictionSlice,
} from "./prediction-slice";
import { createOpinionSlice, type OpinionSlice } from "./opinion-slice";
import { createFilmSlice, type FilmSlice } from "./film-slice";
import { createRewardSlice, type RewardSlice } from "./rewards-slice";

export type MainStore = UserSlice &
  PredictionSlice &
  OpinionSlice &
  FilmSlice &
  RewardSlice;

const middlewares = (stateCreator: StateCreator<MainStore, [], []>) =>
  devtools(stateCreator, { name: "mainStore", serialize: { options: true } });

export const createMainStore = () =>
  create<MainStore>()(
    middlewares((...a) => ({
      ...createUserSlice(...a),
      ...createPredictionSlice(...a),
      ...createOpinionSlice(...a),
      ...createFilmSlice(...a),
      ...createRewardSlice(...a),
    })),
  );
