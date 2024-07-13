"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictions } from "~/service/apiUtils";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";
import { PredictionCardSkeletons } from "~/components/prediction-card-skeleton";

const PredictionPage = () => {
  const { predictions, setActivePredictions } = useMainStore((state) => ({
    predictions: filterMapValuesInArray(
      state.predictions,
      (_, prediction) => !!prediction.isActive,
    ),
    setActivePredictions: state.setActivePredictions,
  }));

  const { isLoading } = useLoadData(
    "activePredictions",
    () => getPredictions({ isActive: true }),
    setActivePredictions,
  );

  return isLoading ? (
    <PredictionCardSkeletons repeat={7} />
  ) : (
    predictions.map((prediction) => (
      <PredictionCard key={prediction.predictionId} prediction={prediction} />
    ))
  );
};

export default PredictionPage;
