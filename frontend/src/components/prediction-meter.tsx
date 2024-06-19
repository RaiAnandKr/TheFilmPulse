import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  cn,
  type SliderValue,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { CoinsImage } from "~/res/images/CoinsImage";
import { GiftBoxImage } from "~/res/images/GiftBoxImage";
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

interface PredictButtonProps {
  onPrediction: () => void;
  predictionScaleUnitLabel: string;
  meanPredictionValue: number;
  userPredictionValue: number;
}

const PredictButton: React.FC<PredictButtonProps> = (props) => {
  return (
    <Popover placement="top" showArrow>
      <PopoverTrigger>
        <Button
          variant="solid"
          color="warning"
          className="flex-none font-bold text-white"
        >
          Predict
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={
          "w-[260px] bg-gradient-to-r from-warning-400 to-warning-200 p-2.5"
        }
      >
        {(_) => (
          <div className="flex w-full flex-col items-center">
            <h4 className="w-ful h-full font-bold text-warning-700">Predict</h4>
            <div className="mt-2 flex w-full flex-col gap-2 rounded-lg border-2 border-white bg-white p-2">
              <div className="flex flex-col rounded-lg border-2 border-dashed border-success bg-success-50 p-2 font-semibold text-success">
                <h5 className="font-bold underline">Rewards</h5>
                <p className="flex justify-between">
                  <span>Top 3 wins gifts</span>
                  <span>
                    <GiftBoxImage />
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Top 100 wins coins</span>
                  <span>
                    <CoinsImage />
                  </span>
                </p>
              </div>

              <p className="flex justify-between text-default-500">
                <span>Average prediction :</span>
                <span>
                  {props.meanPredictionValue} {props.predictionScaleUnitLabel}
                </span>
              </p>
              <p className="flex justify-between font-bold text-warning">
                <span>Your prediction :</span>
                <span>
                  {props.userPredictionValue} {props.predictionScaleUnitLabel}
                </span>
              </p>

              <Button
                variant="solid"
                color="primary"
                className="font-bold text-white"
                onClick={props.onPrediction}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const getSliderValueInNumber = (value: SliderValue) =>
  typeof value === "number" ? value : value[1] ?? 0;
