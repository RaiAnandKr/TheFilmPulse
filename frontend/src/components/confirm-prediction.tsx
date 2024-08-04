import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  type useDisclosure,
} from "@nextui-org/react";
import { CoinsImage } from "~/res/images/CoinsImage";
import { GiftBoxImage } from "~/res/images/GiftBoxImage";
import type { PredictButtonProps } from "~/schema/PredictButtonProps";
import { PredictionSlider } from "./prediction-slider";
import { ConfirmActionFooter } from "./confirm-action-footer";
import { FilmHeader } from "./film-header";

type ConfirmPredictionProps = ReturnType<typeof useDisclosure> &
  PredictButtonProps;

export const ConfirmPrediction: React.FC<ConfirmPredictionProps> = (props) => {
  const {
    isOpen,
    onOpenChange,
    onPrediction,
    prediction,
    predictionPointer,
    onChange,
    inDarkTheme,
    isDisabled,
  } = props;

  const {
    title,
    meanPrediction,
    predictionScaleUnit,
    endDate,
    participationCount,
    filmId,
  } = prediction;
  const predictionScaleUnitLabel = predictionScaleUnit ?? "";

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="justify-center bg-warning-100 p-4 pr-10">
              <FilmHeader filmId={filmId} appendNavigationPath="predictions" />
            </ModalHeader>
            <ModalBody className="p-4">
              <div className="flex flex-col rounded-lg border-2 border-dashed border-success bg-success-50 p-2 font-semibold text-success">
                <p className="flex justify-between">
                  <span>Top 3 wins gifts</span>
                  <span>
                    <GiftBoxImage />
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Top 10% wins coins</span>
                  <span>
                    <CoinsImage />
                  </span>
                </p>
              </div>

              <p className="text-md p-0 font-bold">{title}</p>

              <PredictionSlider
                prediction={prediction}
                onChange={onChange}
                predictionPointer={predictionPointer}
                isDisabled={isDisabled}
                inDarkTheme={inDarkTheme}
                baseClassOverride={"h-12 mb-0"}
                noLabel
              />

              <p className="flex justify-between text-default-500">
                <span>Average prediction :</span>
                <span>
                  {meanPrediction} {predictionScaleUnitLabel}
                </span>
              </p>
              <p className="flex justify-between font-bold text-warning">
                <span>Your prediction :</span>
                <span>
                  {predictionPointer} {predictionScaleUnitLabel}
                </span>
              </p>
            </ModalBody>
            <ConfirmActionFooter
              onClose={onClose}
              onParticipation={onPrediction}
              endDate={endDate}
              totalParticipations={participationCount}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
