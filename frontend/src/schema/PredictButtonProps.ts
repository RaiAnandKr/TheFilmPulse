import type { SliderValue } from "@nextui-org/react";
import type { Prediction } from "./Prediction";

export interface PredictButtonProps {
  onPrediction: () => void;
  prediction: Prediction;
  predictionPointer: number;
  onChange: (value: SliderValue) => void;
  hasUserPredicted: boolean;
  isDisabled: boolean;
  inDarkTheme?: boolean;
}
