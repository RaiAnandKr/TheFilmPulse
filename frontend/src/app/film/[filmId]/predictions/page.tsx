"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictionsFromFilmId } from "~/constants/mocks";
import { useScrollToTop } from "~/hooks/useScrollToTop";

const FilmPredictionsPage = ({ params }: { params: { filmId: string } }) => {
  useScrollToTop();
  return getPredictionsFromFilmId(params.filmId)?.map((prediction) => (
    <PredictionCard key={prediction.predictionId} prediction={prediction} />
  ));
};

export default FilmPredictionsPage;
