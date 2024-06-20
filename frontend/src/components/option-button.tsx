import {
  Button,
  Slider,
  cn,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import type { Vote, UserVote } from "../schema/Opinion";
import { OpinionOption } from "~/schema/OpinionOption";
import { numberInShorthand } from "../utilities/numberInShorthand";
import { useState } from "react";
import { getUserEarnedCoins } from "~/constants/mocks";
import { CoinsImage } from "~/res/images/CoinsImage";
import type { ClassValue } from "tailwind-variants";
import { TickIcon } from "~/res/icons/tick";

interface OptionButtonProps {
  option: OpinionOption;
  classNames: {
    buttonColor: "success" | "danger";
    contentBgColor: ClassValue;
    contentTextColor: ClassValue;
  };
  icon: JSX.Element;
  votes: Vote[];
  hasVoted: boolean;
  setHasVoted: (value: boolean) => void;
  userVote?: UserVote;
}

export const OptionButton: React.FC<OptionButtonProps> = (props) => {
  const { userVote, option, classNames, icon, hasVoted, setHasVoted } = props;
  const disclosure = useDisclosure();

  const label = option;
  const shouldDisable = hasVoted || !!userVote;
  const isUserVotedOption = userVote?.selectedOption === option;
  const variant = isUserVotedOption ? "flat" : "bordered";
  const className = isUserVotedOption ? "disabled:opacity-75" : "";

  return (
    <>
      <Button
        isDisabled={shouldDisable}
        variant={variant}
        color={classNames.buttonColor}
        fullWidth
        startContent={isUserVotedOption ? <CoinsImage /> : icon}
        onPress={disclosure.onOpen}
        className={className}
      >
        {isUserVotedOption ? numberInShorthand(userVote.coinsUsed) : label}
      </Button>
      <ConfirmOption {...disclosure} {...props} />
    </>
  );
};

type ConfirmOptionProps = ReturnType<typeof useDisclosure> & OptionButtonProps;

const ConfirmOption: React.FC<ConfirmOptionProps> = (props) => {
  const { isOpen, onOpenChange, option, classNames, votes, setHasVoted } =
    props;

  const label = option;
  const earnedCoins = getUserEarnedCoins();
  const defaultCoinsToBet = Math.floor(earnedCoins * 0.3);

  const [hasConfirmedOption, setHasConfirmedOption] = useState(false);
  const [coinstToBet, setCoinsToBet] = useState(defaultCoinsToBet);

  const onSliderChange = (value: number | number[]) => {
    const newValue = typeof value === "number" ? value : value[0] ?? 0;
    setCoinsToBet(newValue);
  };

  const onConfirmButtonPress = (onClose: () => void) => {
    setHasConfirmedOption(true);
    setHasVoted(true);
    setTimeout(onClose, 2000);
  };

  const expectedRewardCoins = getExpectedRewardCoins(
    votes,
    option,
    coinstToBet,
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
            <ModalBody className="p-4">
              <Slider
                label={"Select Coins"}
                showTooltip
                step={1}
                formatOptions={{
                  style: "decimal",
                }}
                maxValue={earnedCoins}
                marks={[
                  {
                    value: 0,
                    label: "0",
                  },
                  {
                    value: earnedCoins,
                    label: earnedCoins.toString(),
                  },
                ]}
                value={coinstToBet}
                onChange={onSliderChange}
                className="max-w-md flex-auto pb-2 text-tiny"
                classNames={{
                  value: "text-teal-500 font-bold",
                }}
              />
              <p className="flex justify-between gap-2 text-default-500">
                <span className="flex-auto">You selected:</span>
                <span className="font-bold text-primary">{coinstToBet}</span>
                <CoinsImage />
              </p>
              <p className="flex justify-between gap-2 font-bold text-success">
                <span className="flex-auto">Expected win:</span>
                <span>+ {expectedRewardCoins}</span>
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
                    color="danger"
                    variant="bordered"
                    onPress={onClose}
                    className="font-bold"
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

const getExpectedRewardCoins = (
  votes: Vote[],
  chosenOption: OpinionOption,
  coinsToBet: number,
) => {
  const totalCoinsOnOtherOption =
    votes.find((vote) => vote.option !== chosenOption)?.coins ?? 0;

  const totalCoinsOnUserOption =
    (votes.find((vote) => vote.option === chosenOption)?.coins ?? 0) +
    coinsToBet;

  if (!coinsToBet) {
    return 0;
  }

  const expectedRewardCoins = Math.floor(
    (coinsToBet / totalCoinsOnUserOption) * totalCoinsOnOtherOption,
  );

  return expectedRewardCoins;
};