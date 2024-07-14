import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { useDisclosureWithLogin } from "~/hooks/useDisclosureWithLogin";
import { TickIcon } from "~/res/icons/tick";
import { CoinsImage } from "~/res/images/CoinsImage";
import { GiftBoxImage } from "~/res/images/GiftBoxImage";

interface PredictButtonProps {
  onPrediction: () => void;
  predictionScaleUnitLabel: string;
  meanPredictionValue: number;
  userPredictionValue: number;
  hasUserPredicted: boolean;
  isDisabled: boolean;
  inDarkTheme?: boolean;
}

export const PredictButton: React.FC<PredictButtonProps> = (props) => {
  const { hasUserPredicted, isDisabled, inDarkTheme } = props;
  const disclosure = useDisclosureWithLogin();
  const buttonText = hasUserPredicted ? "Predicted" : "Predict";
  return (
    <>
      <Button
        isDisabled={isDisabled}
        variant={inDarkTheme ? "solid" : "bordered"}
        color="warning"
        className={cn(
          "flex-none font-bold",
          inDarkTheme && "text-white",
          isDisabled && "opacity-80",
        )}
        onPress={disclosure.onOpen}
      >
        {buttonText}
      </Button>
      <ConfirmPrediction {...disclosure} {...props} />
    </>
  );
};

type ConfirmPredictionProps = ReturnType<typeof useDisclosureWithLogin> &
  PredictButtonProps;

const ConfirmPrediction: React.FC<ConfirmPredictionProps> = (props) => {
  const {
    isOpen,
    onOpenChange,
    onPrediction,
    meanPredictionValue,
    userPredictionValue,
    predictionScaleUnitLabel,
  } = props;

  const [hasConfirmedPrediction, setHasConfirmedPrediction] = useState(false);

  const onConfirmButtonPress = (onClose: () => void) => {
    setHasConfirmedPrediction(true);
    onPrediction();
    setTimeout(onClose, 2000);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="justify-center bg-warning-100">
              <h4 className="font-bold text-warning">Predict</h4>
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
                  <span>Top 100 wins coins</span>
                  <span>
                    <CoinsImage />
                  </span>
                </p>
              </div>
              <p className="flex justify-between text-default-500">
                <span>Average prediction :</span>
                <span>
                  {meanPredictionValue} {predictionScaleUnitLabel}
                </span>
              </p>
              <p className="flex justify-between font-bold text-warning">
                <span>Your prediction :</span>
                <span>
                  {userPredictionValue} {predictionScaleUnitLabel}
                </span>
              </p>
            </ModalBody>
            <ModalFooter className="flex w-full justify-end gap-2">
              {hasConfirmedPrediction ? (
                <Button
                  fullWidth
                  color="success"
                  variant="solid"
                  className="font-bold text-white"
                  startContent={<TickIcon />}
                >
                  Confirmed
                </Button>
              ) : (
                <>
                  <Button
                    fullWidth
                    color="default"
                    variant="bordered"
                    onPress={onClose}
                    className="font-bold text-default-500"
                  >
                    Close
                  </Button>
                  <Button
                    fullWidth
                    color="primary"
                    onPress={() => onConfirmButtonPress(onClose)}
                    className="font-bold text-white"
                  >
                    Confirm
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
