"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictionsFromFilmId } from "~/constants/mocks";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/hooks/useLoadData";
import { useScrollToTop } from "~/hooks/useScrollToTop";
import { filterMapValues } from "~/utilities/filterMapValues";

const FilmPredictionsPage = ({ params }: { params: { filmId: string } }) => {
  const { filmId } = params;
  useScrollToTop();

  const { filmPredictions, setFilmPredictions } = useMainStore((state) => ({
    filmPredictions: filterMapValues(
      state.predictions,
      (_, prediction) => prediction.filmId === filmId,
    ),
    setFilmPredictions: state.setFilmPredictions,
  }));

  useLoadData(
    `filmPredictions_${filmId}`,
    () => getPredictionsFromFilmId(filmId),
    (predictions) => setFilmPredictions(filmId, predictions),
  );

  return filmPredictions.map((prediction) => (
    <PredictionCard
      key={prediction.predictionId}
      prediction={prediction}
      noHeader
    />
  ));
};

export default FilmPredictionsPage;
