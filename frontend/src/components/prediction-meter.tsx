import { Button, Slider } from "@nextui-org/react";
import { MouseEventHandler, useCallback, useState } from "react";
import type { Prediction } from "~/schema/Film";

interface PredictionMeterProps {
  prediction: Prediction;
  inDarkTheme?: boolean;
}

export const PredictionMeter: React.FC<PredictionMeterProps> = (props) => {
  const { prediction, inDarkTheme } = props;
  const {
    userPrediction,
    predictionScaleUnit,
    predictionStepValue,
    predictionRange,
    meanPrediction,
  } = prediction;

  const [hasPredicted, setHasPredicted] = useState(false);

  const onPrediction: MouseEventHandler<HTMLButtonElement> = useCallback(
    (ev) => {
      setHasPredicted(true);
    },
    [],
  );

  const predictionScaleUnitLabel = predictionScaleUnit
    ? `In ${predictionScaleUnit}`
    : " ";

  const defaultValue = (predictionRange[0] + predictionRange[1]) / 2;

  const additionalClassName = inDarkTheme ? "text-white/60" : "";

  return (
    <Slider
      label={predictionScaleUnitLabel}
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
          value: meanPrediction,
          label: "Avg",
        },
      ]}
      defaultValue={defaultValue}
      value={userPrediction}
      fillOffset={meanPrediction}
      className={`mb-3 max-w-md flex-auto text-tiny ${additionalClassName}`}
      classNames={{ value: "text-teal-500 font-bold" }}
      endContent={
        <Button
          variant="solid"
          color="primary"
          className="flex-none font-bold text-white"
          onClick={onPrediction}
        >
          Predict
        </Button>
      }
    />
  );
};
