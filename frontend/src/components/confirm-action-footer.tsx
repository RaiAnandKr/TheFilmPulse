import { Button, ModalFooter } from "@nextui-org/react";
import { TickIcon } from "~/res/icons/tick";
import { TimerAndParticipations } from "./timer-and-participations";
import { useCallback, useState } from "react";
import { UI_TIMEOUT_IN_MILLIS } from "~/constants/ui-configs";
import { useMainStore } from "~/data/contexts/store-context";
import { useNavigateToLogin } from "~/hooks/useNavigateToLogin";

interface ConfirmActionFooterProps {
  onClose: () => void;
  onParticipation: () => void;
  endDate: string;
  totalParticipations: number;
  isParticipationDisabled?: boolean;
}

export const ConfirmActionFooter: React.FC<ConfirmActionFooterProps> = (
  props,
) => {
  const {
    onClose,
    onParticipation,
    endDate,
    totalParticipations,
    isParticipationDisabled,
  } = props;

  const [hasConfirmedOption, setHasConfirmedOption] = useState(false);
  const isUserLoggedIn = useMainStore((state) => state.isUserLoggedIn);

  const onConfirmButtonPress = useCallback(() => {
    setHasConfirmedOption(true);
    onParticipation();
    setTimeout(onClose, UI_TIMEOUT_IN_MILLIS);
  }, [onParticipation, onClose]);

  return (
    <ModalFooter className="flex w-full flex-col items-center justify-center gap-2">
      {!isUserLoggedIn && (
        <p className="font-bold text-danger">
          You need to login to participate!
        </p>
      )}
      <div className="flex w-full justify-around gap-2">
        {hasConfirmedOption ? (
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
            <ConfirmOrLoginButton
              onConfirm={onConfirmButtonPress}
              isParticipationDisabled={isParticipationDisabled}
            />
          </>
        )}
      </div>

      <TimerAndParticipations
        endDate={endDate}
        totalParticipations={totalParticipations}
        showInRow
      />
    </ModalFooter>
  );
};

const ConfirmOrLoginButton: React.FC<{
  onConfirm: () => void;
  isParticipationDisabled?: boolean;
}> = (props) => {
  const { onConfirm, isParticipationDisabled } = props;

  const isUserLoggedIn = useMainStore((state) => state.isUserLoggedIn);
  const navigateToLogin = useNavigateToLogin();

  return isUserLoggedIn ? (
    <Button
      fullWidth
      isDisabled={isParticipationDisabled}
      color="primary"
      onPress={onConfirm}
      className="font-bold text-white"
    >
      Confirm
    </Button>
  ) : (
    <Button
      fullWidth
      color="primary"
      onPress={navigateToLogin}
      className="font-bold text-white"
    >
      Login
    </Button>
  );
};
