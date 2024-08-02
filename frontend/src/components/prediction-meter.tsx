import { type SliderValue } from "@nextui-org/react";
import { useMemo, useState } from "react";
import type { Prediction } from "~/schema/Prediction";
import { PredictButton } from "./predict-button";
import { useMainStore } from "~/data/contexts/store-context";
import { postUserPrediction } from "~/service/apiUtils";
import { differenceInDays } from "~/utilities/differenceInDays";
import { isValidPrediction } from "~/utilities/isValidPrediction";
import { PredictionSlider } from "./prediction-slider";

export interface PredictionMeterProps {
  prediction: Prediction;
  inDarkTheme?: boolean;
  noButton?: boolean;
}

export const PredictionMeter: React.FC<PredictionMeterProps> = (props) => {
  const { prediction, inDarkTheme, noButton } = props;
  const { predictionRange, predictionId, userPrediction, endDate } = prediction;

  const defaultValue = (predictionRange[0] + predictionRange[1]) / 2;

  const [predictionPointer, setPredictionPointer] = useState(defaultValue);
  const addUserPrediction = useMainStore((state) => state.addUserPrediction);

  const hasUserPredicted = isValidPrediction(userPrediction);
  const hasPredictionEnded =
    differenceInDays(new Date(), new Date(endDate)) < 0;
  const shouldDisableAction = hasUserPredicted || hasPredictionEnded;

  const onChange = (value: SliderValue) => {
    setPredictionPointer(getSliderValueInNumber(value));
  };

  const endContentElement = useMemo(() => {
    const onPrediction = () => {
      addUserPrediction(predictionId, predictionPointer);
      postUserPrediction(predictionId, predictionPointer).catch(console.log);
    };

    return noButton ? null : (
      <PredictButton
        onPrediction={onPrediction}
        prediction={prediction}
        predictionPointer={predictionPointer}
        onChange={onChange}
        inDarkTheme={inDarkTheme}
        hasUserPredicted={hasUserPredicted}
        isDisabled={shouldDisableAction}
      />
    );
  }, [
    addUserPrediction,
    predictionId,
    noButton,
    prediction,
    predictionPointer,
    onChange,
    inDarkTheme,
    hasUserPredicted,
    shouldDisableAction,
  ]);

  return (
    <PredictionSlider
      prediction={prediction}
      onChange={onChange}
      predictionPointer={predictionPointer}
      isDisabled={shouldDisableAction}
      endContent={endContentElement}
      inDarkTheme={inDarkTheme}
    />
  );
};

const getSliderValueInNumber = (value: SliderValue) =>
  typeof value === "number" ? value : value[1] ?? 0;
