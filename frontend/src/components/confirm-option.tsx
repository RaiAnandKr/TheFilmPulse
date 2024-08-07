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
  Divider,
} from "@nextui-org/react";
import { CoinsImage } from "~/res/images/CoinsImage";
import type { OpinionOption } from "~/schema/OpinionOption";
import type { Vote } from "~/schema/Opinion";
import type { OptionButtonProps } from "~/schema/OptionButtonProps";
import { ConfirmActionFooter } from "./confirm-action-footer";
import { FilmHeader } from "./film-header";

type ConfirmOptionProps = ReturnType<typeof useDisclosure> & OptionButtonProps;

interface ExpectedRewardCoins {
  additionalCoins: number;
  totalCoins: number;
}

export const ConfirmOption: React.FC<ConfirmOptionProps> = (props) => {
  const { isOpen, onOpenChange, classNames, opinion } = props;

  const isUserLoggedIn = useMainStore((state) => state.isUserLoggedIn);

  const coinsToBetProps = useCoinsToBet(props);

  const userIsLoggedInButHasNoBalance =
    isUserLoggedIn && coinsToBetProps.maxCoinsToBet <= 0;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className={cn(
                "justify-center p-4 pr-10",
                classNames.contentBgColor,
              )}
            >
              <FilmHeader filmId={opinion.filmId} />
            </ModalHeader>
            {userIsLoggedInButHasNoBalance ? (
              <ModalBody className="p-4">
                <p className="self-center font-bold text-danger">
                  You have zero balance!
                </p>
              </ModalBody>
            ) : (
              <CoinsSelector
                {...props}
                onClose={onClose}
                {...coinsToBetProps}
              />
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const CoinsSelector: React.FC<
  ConfirmOptionProps & ReturnType<typeof useCoinsToBet>
> = (props) => {
  const {
    opinion,
    option,
    onOpinionConfirmed,
    onClose,
    coinsToBet,
    maxCoinsToBet,
    minCoinsToBet,
    onSliderChange,
    classNames,
  } = props;
  const { userVote, votes, title, endDate } = opinion;

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
      <ModalBody className="gap-2 p-4 pb-0">
        <p className="text-md p-0 font-bold">{title}</p>
        <p className="flex justify-between gap-2 font-bold text-default-500">
          <span className="flex-auto">Your answer:</span>
          <span className={cn("font-bold", classNames.contentTextColor)}>
            {option}
          </span>
        </p>
        <Divider />
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
