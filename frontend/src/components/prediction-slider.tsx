import { cn, Slider, type SliderValue } from "@nextui-org/react";
import { ReactNode } from "react";
import type { Prediction } from "~/schema/Prediction";
import type { ClassValue } from "tailwind-variants";

interface PredictionSliderProps {
  prediction: Prediction;
  onChange: (value: SliderValue) => void;
  predictionPointer: number;
  isDisabled: boolean;
  endContent?: ReactNode;
  inDarkTheme?: boolean;
  noLabel?: boolean;
  baseClassOverride?: ClassValue;
}

export const PredictionSlider: React.FC<PredictionSliderProps> = (props) => {
  const {
    prediction,
    onChange,
    predictionPointer,
    isDisabled,
    endContent,
    inDarkTheme,
    noLabel,
    baseClassOverride,
  } = props;

  const {
    title,
    predictionScaleUnit,
    predictionStepValue,
    predictionRange,
    meanPrediction,
    userPrediction,
  } = prediction;

  const defaultValue = (predictionRange[0] + predictionRange[1]) / 2;

  const label = noLabel ? null : title;

  const textColorClassName = inDarkTheme ? "text-white/80" : "";

  const effectivePivotValue = Math.max(meanPrediction, predictionRange[0]);

  const effectivePivotLabel = "Avg";

  const effectiveFillOffset =
    effectivePivotValue === predictionRange[0]
      ? undefined
      : effectivePivotValue;

  const predictionScaleUnitLabel = predictionScaleUnit ?? "";

  return (
    <Slider
      label={label}
      isDisabled={isDisabled}
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
      classNames={{
        base: cn(
          "mb-3 h-20 max-w-md flex-auto text-tiny",
          textColorClassName,
          baseClassOverride,
        ),
        value: "text-warning flex-none text-center font-bold min-w-20",
        label: "flex-auto font-medium",
        labelWrapper: "gap-2 items-end",
      }}
      endContent={endContent}
      getValue={(value) => `${value.toString()} ${predictionScaleUnitLabel}`}
      onChange={onChange}
    />
  );
};
