"use client";

import { PredictionCard } from "~/components/prediction-card";
import { getPredictions } from "~/constants/mocks";

const PredictionPage = () =>
  getPredictions().map((prediction) => (
    <PredictionCard key={prediction.predictionId} prediction={prediction} />
  ));

export default PredictionPage;
