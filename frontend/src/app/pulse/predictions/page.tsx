"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictions } from "~/constants/mocks";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { filterMapValues } from "~/utilities/filterMapValues";

const PredictionPage = () => {
  const { predictions, setActivePredictions } = useMainStore((state) => ({
    predictions: filterMapValues(
      state.predictions,
      (_, prediction) => !!prediction.isActive,
    ),
    setActivePredictions: state.setActivePredictions,
  }));

  useLoadData(
    "activePredictions",
    () => getPredictions({ isActive: true }),
    setActivePredictions,
  );

  return predictions.map((prediction) => (
    <PredictionCard key={prediction.predictionId} prediction={prediction} />
  ));
};

export default PredictionPage;
