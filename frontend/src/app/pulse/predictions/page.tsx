"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictions } from "~/constants/mocks";

const PredictionPage = () =>
  getPredictions({ isActive: true }).map((prediction) => (
    <PredictionCard key={prediction.predictionId} prediction={prediction} />
  ));

export default PredictionPage;
