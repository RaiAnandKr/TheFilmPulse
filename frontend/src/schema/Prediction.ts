import type { PulseResult } from "./PulseResult";
import type { PulseType } from "./PulseType";

export type Prediction = {
  type: PulseType.Prediction;
  predictionId: string;
  title: string; // I think we should change this to 'text'. title is very closely linked with Film.
  filmId: string;
  endDate: string;
  meanPrediction: number;
  participationCount: number;
  predictionRange: [number, number];
  predictionStepValue: number;
  predictionScaleUnit?: string; //Eg. "Cr"
  userPrediction?: number;
  result?: PulseResult<number>;

  // For client-side state management
  isActive?: boolean;
};
