import { Button, Slider } from "@nextui-org/react";
import { useCallback, useMemo, useState, type MouseEventHandler } from "react";
import type { Prediction } from "~/schema/Prediction";

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

  const onPrediction: MouseEventHandler<HTMLButtonElement> = useCallback(
    (_) => {
      setHasPredicted(true);
    },
    [],
  );

  const defaultValue = (predictionRange[0] + predictionRange[1]) / 2;

  const additionalClassName = inDarkTheme ? "text-white/60" : "";

  const effectivePivotValue = pivotValue ?? meanPrediction;
  const effectivePivotLabel = pivotLabel ?? "Avg";

  const endContentElement = useMemo(
    () =>
      noButton ? null : (
        <Button
          variant="solid"
          color="primary"
          className="flex-none font-bold text-white"
          onClick={onPrediction}
        >
          Predict
        </Button>
      ),
    [noButton, onPrediction],
  );

  return (
    <Slider
      label={prediction.title}
      isDisabled={hasPredicted || !!userPrediction}
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
      value={userPrediction}
      fillOffset={effectivePivotValue}
      className={`mb-3 h-20 max-w-md flex-auto text-tiny ${additionalClassName}`}
      classNames={{ value: "text-teal-500 font-bold flex-none" }}
      endContent={endContentElement}
      getValue={(value) => `${value.toString()} ${predictionScaleUnit ?? ""}`}
    />
  );
};
