import { Button, useDisclosure, type ButtonProps } from "@nextui-org/react";
import { OpinionOption } from "~/schema/OpinionOption";
import { numberInShorthand } from "../utilities/numberInShorthand";
import { CoinsImage } from "~/res/images/CoinsImage";
import type { OptionButtonProps } from "~/schema/OptionButtonProps";
import { ConfirmOption } from "./confirm-option";
import { differenceInDays } from "~/utilities/differenceInDays";

export const OptionButton: React.FC<OptionButtonProps> = (props) => {
  const { option, classNames, opinion } = props;
  const { userVote, endDate } = opinion;

  const disclosure = useDisclosure();

  const label = option;
  const hasUserParticipated = !!userVote;
  const hasOpinionEnded = differenceInDays(new Date(), new Date(endDate)) < 0;
  const shouldDisable = hasUserParticipated || hasOpinionEnded;
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
        onPress={disclosure.onOpen}
        className={className}
        {...getOptionTerminalContentProps(props)}
      >
        {isUserVotedOption ? numberInShorthand(userVote.coinsUsed) : label}
      </Button>
      <ConfirmOption {...disclosure} {...props} />
    </>
  );
};

const getOptionTerminalContentProps = (
  props: OptionButtonProps,
): Pick<ButtonProps, "startContent" | "endContent"> => {
  const { option, opinion, icon } = props;
  const isUserVotedOption = opinion.userVote?.selectedOption === option;

  switch (option) {
    case OpinionOption.Yes:
      return { startContent: isUserVotedOption ? <CoinsImage /> : icon };
    case OpinionOption.No:
      return { endContent: isUserVotedOption ? <CoinsImage flip /> : icon };
  }

  return {};
};
