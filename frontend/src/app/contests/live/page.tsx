"use client";

import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import { getOpinions, getPredictions } from "~/service/apiUtils";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";
import { OpinionCardSkeletons } from "~/components/opinion-card-skeleton";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";

const ContestsPage = () => {
  const {
    opinions,
    setActiveOpinions,
    predictions,
    setActivePredictions
  } = useMainStore((state) => ({
    opinions: filterMapValuesInArray(
      state.opinions,
      // Exclude the opinions user has already participated in.
      (_, opinion) => !!opinion.isActive && !opinion.userVote
    ),
    predictions: filterMapValuesInArray(
      state.predictions,
      // Exclude the predictions user has already participated in.
      (_, prediction) => !!prediction.isActive && !prediction.userPrediction
    ),
    setActiveOpinions: state.setActiveOpinions,
    setActivePredictions: state.setActivePredictions,
  }));

  const { isLoading: isLoadingOpinions } = useLoadData(
    "activeOpinions",
    () => getOpinions({ isActive: true }),
    setActiveOpinions,
  );

  const { isLoading: isLoadingPredictions } = useLoadData(
    "activePredictions",
    () => getPredictions({ isActive: true }),
    setActivePredictions,
  );

  // Just using the OpinionCardSkeletons is good enough to show something is loading
  // and no need to load PredictionCardSkeletons.
  if (isLoadingOpinions || isLoadingPredictions) {
    return (
      <>
         <OpinionCardSkeletons repeat={5} useFullWidth />
      </>
    );
  }

  // Combine opinions and predictions and sort them in descending order of participation count.
  const combinedItems = [
    ...opinions.map((opinion) => ({ ...opinion, type: "opinion" })),
    ...predictions.map((prediction) => ({ ...prediction, type: "prediction" })),
  ];

  combinedItems.sort((a, b) => b.participationCount - a.participationCount);

  return (
    <>
       {combinedItems.map(item =>
         item.type === "opinion" ? (
           <OpinionCard opinion={item as Opinion} key={(item as Opinion).opinionId} useFullWidth />
         ) : (
           <PredictionCard key={(item as Prediction).predictionId} prediction={item as Prediction} />
         )
      )}
    </>
  );
};

export default ContestsPage;