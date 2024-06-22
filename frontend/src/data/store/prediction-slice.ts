import { StateCreator } from "zustand";
import type { Prediction } from "~/schema/Prediction";
import { mergeArrayToMap } from "~/utilities/mergeArrayToMap";

type PredictionState = {
  predictions: Map<Prediction["predictionId"], Prediction>;
};

type PredictionAction = {
  setActivePredictions: (predictions: Prediction[]) => void;
};

export type PredictionSlice = PredictionState & PredictionAction;

export const createPredictionSlice: StateCreator<
  PredictionSlice,
  [["zustand/devtools", never]],
  [],
  PredictionSlice
> = (set) => ({
  predictions: new Map(),
  setActivePredictions: (predictions) =>
    set(
      (state) => ({
        predictions: mergeArrayToMap(
          state.predictions,
          predictions,
          "predictionId",
          {
            isActive: true,
          },
        ),
      }),
      false,
      "PredictionAction/setActivePredictions",
    ),
});
