import { Slider, cn, type SliderValue } from "@nextui-org/react";
import { useMemo, useState } from "react";
import type { Prediction } from "~/schema/Prediction";
import { PredictButton } from "./predict-button";
import { useMainStore } from "~/data/contexts/store-context";
import { postUserPrediction } from "~/service/apiUtils";
import { differenceInDays } from "~/utilities/differenceInDays";

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
    endDate,
  } = prediction;

  const defaultValue = (predictionRange[0] + predictionRange[1]) / 2;

  const [predictionPointer, setPredictionPointer] = useState(defaultValue);

  const addUserPrediction = useMainStore((state) => state.addUserPrediction);

  const additionalClassName = inDarkTheme ? "text-white/80" : "";

  const effectivePivotValue =
    pivotValue ?? Math.max(meanPrediction, predictionRange[0]);
  const effectivePivotLabel = pivotLabel ?? "Avg";
  const effectiveFillOffset =
    effectivePivotValue === predictionRange[0]
      ? undefined
      : effectivePivotValue;

  const predictionScaleUnitLabel = predictionScaleUnit ?? "";

  const hasUserPredicted =
    typeof userPrediction === "number" && !isNaN(userPrediction);
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
        meanPredictionValue={meanPrediction}
        predictionScaleUnitLabel={predictionScaleUnitLabel}
        userPredictionValue={predictionPointer}
        inDarkTheme={inDarkTheme}
        hasUserPredicted={hasUserPredicted}
        isDisabled={shouldDisableAction}
      />
    );
  }, [
    addUserPrediction,
    predictionId,
    noButton,
    meanPrediction,
    predictionScaleUnitLabel,
    predictionPointer,
    inDarkTheme,
    hasUserPredicted,
    shouldDisableAction,
  ]);

  return (
    <Slider
      label={prediction.title}
      isDisabled={shouldDisableAction}
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
        value: "text-warning flex-none text-center px-2 font-bold",
        label: "flex-auto font-medium",
        labelWrapper: "gap-2 items-end",
      }}
      endContent={endContentElement}
      getValue={(value) => `${value.toString()} ${predictionScaleUnitLabel}`}
      onChange={onChange}
    />
  );
};

const getSliderValueInNumber = (value: SliderValue) =>
  typeof value === "number" ? value : value[1] ?? 0;
