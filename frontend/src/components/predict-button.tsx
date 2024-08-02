import { Button, cn } from "@nextui-org/react";
import { useDisclosureWithLogin } from "~/hooks/useDisclosureWithLogin";
import { ConfirmPrediction } from "./confirm-prediction";
import type { PredictButtonProps } from "~/schema/PredictButtonProps";

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
      <ConfirmPrediction {...disclosure} {...props} inDarkTheme={false} />
    </>
  );
};
