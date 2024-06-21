import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createUserSlice, type UserSlice } from "./user-slice";
import {
  createPredictionSlice,
  type PredictionSlice,
} from "./prediction-slice";
import { createOpinionSlice, type OpinionSlice } from "./opinion-slice";
import { createFilmSlice, type FilmSlice } from "./film-slice";

type Store = UserSlice & PredictionSlice & OpinionSlice & FilmSlice;

const middlewares = (stateCreator: StateCreator<Store, [], []>) =>
  devtools(stateCreator, { name: "mainStore" });

export const useBoundStore = create<Store>()(
  middlewares((...a) => ({
    ...createUserSlice(...a),
    ...createPredictionSlice(...a),
    ...createOpinionSlice(...a),
    ...createFilmSlice(...a),
  })),
);
