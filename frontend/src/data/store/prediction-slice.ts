import { StateCreator } from "zustand";
import type { Prediction } from "~/schema/Prediction";

type PredictionState = {
  predictions: Map<Prediction["predictionId"], Prediction>;
};

type PredictionAction = {};

export type PredictionSlice = PredictionState & PredictionAction;

export const createPredictionSlice: StateCreator<
  PredictionSlice,
  [],
  [],
  PredictionSlice
> = (set) => ({
  predictions: new Map(),
});
