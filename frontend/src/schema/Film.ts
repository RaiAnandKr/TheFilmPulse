import type { Prediction } from "./Prediction";

export type Film = {
  filmId: string;
  title: string;
  filmCasts?: string;
  filmDirector?: string;
  filmDesc?: string;
  videoSrc?: string;
  imgSrc: string;
  releaseDate: string;
  topPrediction: Prediction;
  predictionIds?: Pick<Prediction, "predictionId">["predictionId"][];
};
