import type { ContestResult } from "./ContestResult";
import type { ContestType } from "./ContestType";

export type Prediction = {
  type: ContestType.Prediction;
  predictionId: string;
  title: string; // I think we should change this to 'text'. title is very closely linked with Film.
  filmId: string;
  endDate: string;
  meanPrediction: number;
  participationCount: number;
  predictionRange: [number, number];
  predictionStepValue: number;
  predictionScaleUnit?: string; //Eg. "Cr"
  userPrediction?: number | null;
  result?: ContestResult<number>;

  // For client-side state management
  isActive?: boolean;
};
