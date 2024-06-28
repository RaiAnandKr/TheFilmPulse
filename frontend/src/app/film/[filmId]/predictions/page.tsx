"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictionsFromFilmId } from "~/service/apiUtils";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { useScrollToTop } from "~/hooks/useScrollToTop";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";

const FilmPredictionsPage = ({ params }: { params: { filmId: string } }) => {
  const { filmId } = params;
  useScrollToTop();

  const { filmPredictions, setFilmPredictions } = useMainStore((state) => ({
    filmPredictions: filterMapValuesInArray(
      state.predictions,
      (_, prediction) => prediction.filmId === filmId,
    ),
    setFilmPredictions: state.setFilmPredictions,
  }));

  useLoadData(
    `filmPredictions?filmId=${filmId}`,
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
