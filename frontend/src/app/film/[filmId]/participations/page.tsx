"use client";

import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";
import { getOpinionsFromFilmId, getPredictionsFromFilmId } from "~/service/apiUtils";
import { useScrollToTop } from "~/hooks/useScrollToTop";

const FilmContestsPage = ({ params }: { params: { filmId: string } }) => {
  const { filmId } = params;
  useScrollToTop();

  const {
    filmOpinions,
    filmPredictions,
    setFilmOpinions,
    setFilmPredictions
  } = useMainStore((state) => ({
    filmOpinions: filterMapValuesInArray(
      state.opinions,
      (_, opinion) => opinion.filmId === filmId && !!opinion.userVote
    ),
    filmPredictions: filterMapValuesInArray(
      state.predictions,
      (_, prediction) => prediction.filmId === filmId && !!prediction.userPrediction
    ),
    setFilmOpinions: state.setFilmOpinions,
    setFilmPredictions: state.setFilmPredictions,
  }));

  useLoadData(
    `filmOpinions?filmId=${filmId}`,
    () => getOpinionsFromFilmId(filmId),
    (opinions) => setFilmOpinions(filmId, opinions),
  );

  useLoadData(
    `filmPredictions?filmId=${filmId}`,
    () => getPredictionsFromFilmId(filmId),
    (predictions) => setFilmPredictions(filmId, predictions),
  );

  // Combine opinions and predictions and sort them in descending order of end date.
  const combinedItems = [
    ...filmOpinions.map((opinion) => ({ ...opinion, type: "opinion" })),
    ...filmPredictions.map((prediction) => ({ ...prediction, type: "prediction" })),
  ];

  combinedItems.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  return (
    <div>
      {combinedItems.map((item) => {
        if ('opinionId' in item) {
          return (
            <OpinionCard
              opinion={item as Opinion}
              key={(item as Opinion).opinionId}
              useFullWidth
              useFooter
            />
          );
        } else {
          return (
            <PredictionCard
              key={(item as Prediction).predictionId}
              prediction={item as Prediction}
              noHeader
            />
          );
        }
      })}
    </div>
  );  
};

export default FilmContestsPage;
