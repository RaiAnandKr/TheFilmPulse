import { Slider, cn, type SliderValue } from "@nextui-org/react";
import { useMemo, useState } from "react";
import type { Prediction } from "~/schema/Prediction";
import { PredictButton } from "./predict-button";

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
    userPrediction,
    predictionScaleUnit,
    predictionStepValue,
    predictionRange,
    meanPrediction,
  } = prediction;

  const [hasPredicted, setHasPredicted] = useState(false);

  const onPrediction = () => {
    setHasPredicted(true);
  };

  const defaultValue = (predictionRange[0] + predictionRange[1]) / 2;

  const additionalClassName = inDarkTheme ? "text-white/80" : "";

  const effectivePivotValue = pivotValue ?? meanPrediction;
  const effectivePivotLabel = pivotLabel ?? "Avg";

  const predictionScaleUnitLabel = predictionScaleUnit ?? "";

  const [predictionPointer, setPredictionPointer] = useState(defaultValue);
  const onChange = (value: SliderValue) => {
    setPredictionPointer(getSliderValueInNumber(value));
  };

  const endContentElement = useMemo(
    () =>
      noButton ? null : (
        <PredictButton
          onPrediction={onPrediction}
          meanPredictionValue={meanPrediction}
          predictionScaleUnitLabel={predictionScaleUnitLabel}
          userPredictionValue={predictionPointer}
        />
      ),
    [noButton, onPrediction],
  );

  return (
    <Slider
      label={prediction.title}
      isDisabled={hasPredicted || !!userPrediction}
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
      value={hasPredicted ? userPrediction : predictionPointer}
      fillOffset={effectivePivotValue}
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
