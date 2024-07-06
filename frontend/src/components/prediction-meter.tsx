import { Slider, cn, type SliderValue } from "@nextui-org/react";
import { useMemo, useState } from "react";
import type { Prediction } from "~/schema/Prediction";
import { PredictButton } from "./predict-button";
import { useMainStore } from "~/data/contexts/store-context";
import { postUserPrediction } from "~/service/apiUtils";

export interface PredictionMeterProps {
  prediction: Prediction;
  inDarkTheme?: boolean;
  pivotValue?: number;
  pivotLabel?: string;
  noButton?: boolean;
}

export const PredictionMeter: React.FC<PredictionMeterProps> = (props) => {
  const { prediction, inDarkTheme, pivotLabel, pivotValue, noButton } = props;
  const {
    predictionScaleUnit,
    predictionStepValue,
    predictionRange,
    meanPrediction,
    predictionId,
    userPrediction,
  } = prediction;

  const addUserPrediction = useMainStore((state) => state.addUserPrediction);

  const defaultValue = (predictionRange[0] + predictionRange[1]) / 2;

  const additionalClassName = inDarkTheme ? "text-white/80" : "";

  const effectivePivotValue =
    pivotValue ?? Math.max(meanPrediction, predictionRange[0]);
  const effectivePivotLabel = pivotLabel ?? "Avg";
  const effectiveFillOffset =
    effectivePivotValue === predictionRange[0]
      ? undefined
      : effectivePivotValue;

  const predictionScaleUnitLabel = predictionScaleUnit ?? "";

  const [predictionPointer, setPredictionPointer] = useState(defaultValue);
  const onChange = (value: SliderValue) => {
    setPredictionPointer(getSliderValueInNumber(value));
  };

  const onPrediction = () => {
    addUserPrediction(predictionId, predictionPointer);
    postUserPrediction(predictionId, predictionPointer).catch(console.log);
  };

  const endContentElement = useMemo(
    () =>
      noButton ? null : (
        <PredictButton
          onPrediction={onPrediction}
          meanPredictionValue={meanPrediction}
          predictionScaleUnitLabel={predictionScaleUnitLabel}
          userPredictionValue={predictionPointer}
          inDarkTheme={inDarkTheme}
        />
      ),
    [
      noButton,
      onPrediction,
      meanPrediction,
      predictionScaleUnitLabel,
      predictionPointer,
    ],
  );

  return (
    <Slider
      label={prediction.title}
      isDisabled={!!userPrediction}
      color="warning"
      showTooltip
      step={predictionStepValue}
      formatOptions={{
        style: "decimal",
      }}
      minValue={predictionRange[0]}
      maxValue={predictionRange[1]}
      marks={[
        {
          value: effectivePivotValue,
          label: effectivePivotLabel,
        },
      ]}
      defaultValue={defaultValue}
      value={userPrediction ?? predictionPointer}
      fillOffset={effectiveFillOffset}
      className={cn(
        "mb-3 h-20 max-w-md flex-auto text-tiny",
        additionalClassName,
      )}
      classNames={{
        value: "text-warning flex-none",
      }}
      endContent={endContentElement}
      getValue={(value) => `${value.toString()} ${predictionScaleUnitLabel}`}
      onChange={onChange}
    />
  );
};

const getSliderValueInNumber = (value: SliderValue) =>
  typeof value === "number" ? value : value[1] ?? 0;
