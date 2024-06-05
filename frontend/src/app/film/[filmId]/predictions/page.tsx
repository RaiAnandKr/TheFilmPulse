"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictionsFromFilmId } from "~/constants/mocks";

const FilmPredictionsPage = ({ params }: { params: { filmId: string } }) =>
  getPredictionsFromFilmId(params.filmId)?.map((prediction) => (
    <PredictionCard key={prediction.predictionId} prediction={prediction} />
  ));

export default FilmPredictionsPage;
