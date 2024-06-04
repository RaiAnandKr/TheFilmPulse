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
  predictions?: Prediction[];
};

export type Prediction = {
  predictionId: string;
  title: string; // I think we should change this to 'text'. title is very closely linked with Film.
  filmId: string;
  startDate: string; // I don't think we need a startDate. If it's in DB it's live.
  endDate: string;
  meanPrediction: number;
  participationCount: number;
  predictionRange: [number, number];
  predictionStepValue: number;
  predictionScaleUnit?: string; //Eg. "Cr"
  userPrediction?: number;
};
