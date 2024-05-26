export type Film = {
  filmId: string;
  title: string;
  filmCasts: string;
  videoSrc: string;
  imgSrc: string;
  topPrediction: Prediction;
};

export type Prediction = {
  predictionId: string;
  title: string;
  filmId: string;
  startDate: string;
  endDate: string;
  meanPrediction: number;
  participationCount: number;
  userPrediction?: number;
};
