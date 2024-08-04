import { useMainStore } from "~/data/contexts/store-context";
import { userMaxOpinionCoinsSelector } from "~/data/store/selectors/userMaxOpinionCoinsSelector";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Slider,
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  type useDisclosure,
} from "@nextui-org/react";
import { CoinsImage } from "~/res/images/CoinsImage";
import type { OpinionOption } from "~/schema/OpinionOption";
import type { Vote } from "~/schema/Opinion";
import type { OptionButtonProps } from "~/schema/OptionButtonProps";
import { ConfirmActionFooter } from "./confirm-action-footer";

type ConfirmOptionProps = ReturnType<typeof useDisclosure> & OptionButtonProps;

interface ExpectedRewardCoins {
  additionalCoins: number;
  totalCoins: number;
}

export const ConfirmOption: React.FC<ConfirmOptionProps> = (props) => {
  const { isOpen, onOpenChange, option, classNames } = props;

  const label = option;

  const { hasNoBalance, isUserLoggedIn } = useMainStore((state) => ({
    hasNoBalance: userMaxOpinionCoinsSelector(state) <= 0,
    isUserLoggedIn: state.isUserLoggedIn,
  }));

  const userIsLoggedInButHasNoBalance = isUserLoggedIn && hasNoBalance;

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
            {userIsLoggedInButHasNoBalance ? (
              <ModalBody className="p-4">
                <p className="self-center font-bold text-danger">
                  You have zero balance!
                </p>
              </ModalBody>
            ) : (
              <CoinsSelector {...props} onClose={onClose} />
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const CoinsSelector: React.FC<ConfirmOptionProps> = (props) => {
  const { votes, option, onOpinionConfirmed, onClose, endDate, userVote } =
    props;

  const { minCoinsToBet, maxCoinsToBet, coinsToBet, onSliderChange } =
    useCoinsToBet(props);

  const expectedRewardCoins = useMemo(
    () => getExpectedRewardCoins(votes, option, coinsToBet),
    [votes, option, coinsToBet],
  );

  const onParticipation = useCallback(() => {
    onOpinionConfirmed({
      selectedOption: option,
      coinsUsed: coinsToBet,
    });
  }, [onOpinionConfirmed, option, coinsToBet]);

  const totalParticipations = votes.reduce(
    (acc, vote) => acc + vote.participationCount,
    0,
  );

  const isValidCoinsToBet = coinsToBet > 0;
  const hasUserParticipated = !!userVote;

  return (
    <>
      <ModalBody className="p-4">
        <Slider
          isDisabled={hasUserParticipated}
          label={"Select Coins"}
          showTooltip
          step={1}
          formatOptions={{
            style: "decimal",
          }}
          maxValue={maxCoinsToBet}
          minValue={minCoinsToBet}
          marks={[
            {
              value: minCoinsToBet,
              label: minCoinsToBet.toString(),
            },
            {
              value: maxCoinsToBet,
              label: maxCoinsToBet.toString(),
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
      <ConfirmActionFooter
        onClose={onClose}
        onParticipation={onParticipation}
        endDate={endDate}
        totalParticipations={totalParticipations}
        isParticipationDisabled={!isValidCoinsToBet}
      />
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

const useCoinsToBet = (props: Pick<ConfirmOptionProps, "isOpen">) => {
  const { isOpen } = props;

  // Global state value for max opinion coins.
  const userMaxOpinionCoins = useMainStore((state) =>
    state.isUserLoggedIn ? userMaxOpinionCoinsSelector(state) : state.xpCoins,
  );
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

  const onSliderChange = useCallback((value: number | number[]) => {
    const newValue = typeof value === "number" ? value : value[0] ?? 0;
    setCoinsToBet(newValue);
  }, []);

  return {
    minCoinsToBet: 0,
    maxCoinsToBet: localMaxCoinsToBet,
    coinsToBet,
    onSliderChange,
  };
};
