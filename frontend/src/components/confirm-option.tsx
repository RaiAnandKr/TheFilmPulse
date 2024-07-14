import { TickIcon } from "~/res/icons/tick";
import { useMainStore } from "~/data/contexts/store-context";
import { userMaxOpinionCoinsSelector } from "~/data/store/selectors/userMaxOpinionCoinsSelector";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Slider,
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useDisclosureWithLogin } from "~/hooks/useDisclosureWithLogin";
import { CoinsImage } from "~/res/images/CoinsImage";
import type { OpinionOption } from "~/schema/OpinionOption";
import type { Vote } from "~/schema/Opinion";
import type { OptionButtonProps } from "~/schema/OptionButtonProps";
import { UI_TIMEOUT_IN_MILLIS } from "~/constants/ui-configs";

type ConfirmOptionProps = ReturnType<typeof useDisclosureWithLogin> &
  OptionButtonProps;

interface ExpectedRewardCoins {
  additionalCoins: number;
  totalCoins: number;
}

export const ConfirmOption: React.FC<ConfirmOptionProps> = (props) => {
  const { isOpen, onOpenChange, option, classNames } = props;

  const label = option;

  const canParticipate = useMainStore(
    (state) => userMaxOpinionCoinsSelector(state) > 0,
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className={cn("justify-center", classNames.contentBgColor)}
            >
              <h4 className={cn("font-bold", classNames.contentTextColor)}>
                {label}
              </h4>
            </ModalHeader>
            {canParticipate ? (
              <CoinsSelector {...props} onClose={onClose} />
            ) : (
              <ModalBody className="p-4">
                <p className="self-center font-bold text-danger">
                  You have zero balance!
                </p>
              </ModalBody>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const CoinsSelector: React.FC<
  Pick<
    ConfirmOptionProps,
    "isOpen" | "votes" | "option" | "onOpinionConfirmed" | "onClose"
  >
> = (props) => {
  const { isOpen, votes, option, onOpinionConfirmed, onClose } = props;
  // Global state value for max opinion coins.
  const userMaxOpinionCoins = useMainStore(userMaxOpinionCoinsSelector);
  const defaultCoinsToBet = Math.floor(userMaxOpinionCoins * 0.5);

  // Local state value. This ensures we don't update the value while the confirm modal is opened after participation.
  const [localMaxCoinsToBet, setLocalMaxCoinsToBet] =
    useState(userMaxOpinionCoins);
  const [coinsToBet, setCoinsToBet] = useState(defaultCoinsToBet);

  useEffect(() => {
    // Updating values on modal open or close.
    setCoinsToBet(defaultCoinsToBet);
    setLocalMaxCoinsToBet(userMaxOpinionCoins);
  }, [isOpen]);

  const [hasConfirmedOption, setHasConfirmedOption] = useState(false);

  const onSliderChange = useCallback((value: number | number[]) => {
    const newValue = typeof value === "number" ? value : value[0] ?? 0;
    setCoinsToBet(newValue);
  }, []);

  const expectedRewardCoins = useMemo(
    () => getExpectedRewardCoins(votes, option, coinsToBet),
    [votes, option, coinsToBet],
  );

  const onConfirmButtonPress = useCallback(() => {
    setHasConfirmedOption(true);
    onOpinionConfirmed({
      selectedOption: option,
      coinsUsed: coinsToBet,
    });
    setTimeout(onClose, UI_TIMEOUT_IN_MILLIS);
  }, [onOpinionConfirmed, option, coinsToBet, onClose]);

  const isValidCoinsToBet = coinsToBet > 0;

  return (
    <>
      <ModalBody className="p-4">
        <Slider
          isDisabled={hasConfirmedOption}
          label={"Select Coins"}
          showTooltip
          step={1}
          formatOptions={{
            style: "decimal",
          }}
          maxValue={localMaxCoinsToBet}
          minValue={0}
          marks={[
            {
              value: 0,
              label: "0",
            },
            {
              value: localMaxCoinsToBet,
              label: localMaxCoinsToBet.toString(),
            },
          ]}
          value={coinsToBet}
          onChange={onSliderChange}
          className="max-w-md flex-auto pb-2 text-tiny"
          classNames={{
            value: "text-teal-500 font-bold",
          }}
        />
        <p className="flex justify-between gap-2 text-default-500">
          <span className="flex-auto">You selected:</span>
          <span className="font-bold text-primary">{coinsToBet}</span>
          <CoinsImage />
        </p>
        <p className="flex justify-between gap-2 font-bold text-success">
          <span className="flex-auto">Expected win:</span>
          <span>
            {expectedRewardCoins.totalCoins} (+
            {expectedRewardCoins.additionalCoins})
          </span>
          <CoinsImage />
        </p>
      </ModalBody>
      <ModalFooter className="flex w-full justify-end gap-2">
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
            <Button
              fullWidth
              isDisabled={!isValidCoinsToBet}
              color="primary"
              onPress={onConfirmButtonPress}
              className="font-bold text-white"
            >
              Confirm
            </Button>
          </>
        )}
      </ModalFooter>
    </>
  );
};

const getExpectedRewardCoins = (
  votes: Vote[],
  chosenOption: OpinionOption,
  coinsToBet: number,
): ExpectedRewardCoins => {
  const totalCoinsOnOtherOption =
    votes.find((vote) => vote.option !== chosenOption)?.coins ?? 0;

  const totalCoinsOnUserOption =
    (votes.find((vote) => vote.option === chosenOption)?.coins ?? 0) +
    coinsToBet;

  if (!coinsToBet) {
    return {
      additionalCoins: 0,
      totalCoins: 0,
    };
  }

  const additionalCoins = Math.floor(
    (coinsToBet / totalCoinsOnUserOption) * totalCoinsOnOtherOption,
  );

  const totalCoins = additionalCoins + coinsToBet;

  return {
    additionalCoins,
    totalCoins,
  };
};
