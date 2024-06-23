import type { StateCreator } from "zustand";
import type { Prediction } from "~/schema/Prediction";
import { mergeArrayToMap } from "~/utilities/mergeArrayToMap";

type PredictionState = {
  predictions: Map<Prediction["predictionId"], Prediction>;
};

type PredictionAction = {
  updatePredictions: <A extends string | { type: string }>(
    actionName: A,
    predictions: Prediction[],
    addMoreProperties?: Partial<Prediction>,
  ) => void;
  setActivePredictions: (predictions: Prediction[]) => void;
  setFilmPredictions: (
    filmId: Prediction["filmId"],
    predictions: Prediction[],
  ) => void;
};

export type PredictionSlice = PredictionState & PredictionAction;

export const createPredictionSlice: StateCreator<
  PredictionSlice,
  [["zustand/devtools", never]],
  [],
  PredictionSlice
> = (set, get) => ({
  predictions: new Map(),
  updatePredictions: (actionName, predictions, addMoreProperties) =>
    set(
      (state) => ({
        predictions: mergeArrayToMap(
          state.predictions,
          predictions,
          "predictionId",
          addMoreProperties,
        ),
      }),
      false,
      typeof actionName === "string"
        ? `PredictionAction/${actionName}`
        : {
            ...(actionName as object),
            type: `PredictionAction/${actionName.type}`,
          },
    ),
  setActivePredictions: (predictions) =>
    get().updatePredictions("setActivePredictions", predictions, {
      isActive: true,
    }),
  setFilmPredictions: (filmId, predictions) =>
    get().updatePredictions(
      { type: "setFilmPredictions", filmId },
      predictions,
    ),
});
