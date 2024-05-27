import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Slider,
  Progress,
} from "@nextui-org/react";
import type { OpinionOption, UserVote } from "../schema/Opinion";
import { CoinIcon } from "../res/icons/coin";
import { GroupIcon } from "../res/icons/group";
import { numberInShorthand } from "../utilities/numberInShorthand";

interface OpinionProps {
  title: string;
  daysToEnd: number;
  options: {
    key: OpinionOption;
    label: string;
    color: "success" | "danger";
    icon: JSX.Element;
    votes: number;
  }[];
  userVote?: UserVote;
}

type OptionsProps = Pick<OpinionProps, "options" | "userVote"> & {
  totalVotes: number;
};

export const OpinionCard: React.FC<OpinionProps> = (props) => {
  const { title, daysToEnd, options } = props;

  const firstOptionVotes = options.at(0)?.votes || 0;
  const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);
  const trendPercent = (firstOptionVotes * 100) / totalVotes;

  return (
    <Card className="h-50 m-3 w-72">
      <CardBody className="p-3.5 text-base">
        <p>{title}</p>
      </CardBody>
      <CardFooter className="flex flex-none flex-col">
        <ParticipationTrend trendPercent={trendPercent} />
        <Options {...props} totalVotes={totalVotes} />
        <p className="p-3 text-xs text-default-400">
          <span className="font-semibold">Ends in:</span>
          <span>{` ${daysToEnd} days`}</span>
        </p>
      </CardFooter>
    </Card>
  );
};

const Options: React.FC<OptionsProps> = (props) => {
  const { options, userVote, totalVotes } = props;

  return (
    <div className="flex w-full justify-between pt-2">
      {options.map((option, index) => {
        const hasUserVoted = !!userVote;
        const isUserVotedOption =
          hasUserVoted && userVote.selectedOption === option.key;
        const isLastOption = index === options.length - 1;

        return (
          <>
            <Popover placement="bottom" showArrow offset={10} key={option.key}>
              <PopoverTrigger>
                <Button
                  isDisabled={hasUserVoted}
                  variant={hasUserVoted ? "flat" : "bordered"}
                  color={option.color}
                  key={option.key}
                  startContent={isUserVotedOption ? <CoinIcon /> : option.icon}
                >
                  {isUserVotedOption ? userVote.coinsUsed : option.label}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px]">
                {(titleProps) => (
                  <div className="flex w-full flex-col items-center px-1 py-2">
                    <Button
                      variant="flat"
                      isDisabled
                      color={option.color}
                      className="font-bold"
                      fullWidth
                    >
                      {option.label}
                    </Button>
                    <div className="mt-2 flex w-full flex-col">
                      <Slider
                        label="Select Coins"
                        showTooltip
                        step={1}
                        formatOptions={{
                          style: "decimal",
                        }}
                        maxValue={100}
                        minValue={0}
                        marks={[
                          {
                            value: 0,
                            label: "0",
                          },
                          {
                            value: 100, // TODO: use maximum available user coins
                            label: "100",
                          },
                        ]}
                        defaultValue={30}
                        className="max-w-md flex-auto pb-2 text-tiny"
                        classNames={{
                          value: "text-teal-500 font-bold",
                        }}
                      />
                      <Button
                        variant="solid"
                        color="secondary"
                        className="font-bold"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {!isLastOption && <TotalParticipation count={totalVotes} />}
          </>
        );
      })}
    </div>
  );
};

const TotalParticipation: React.FC<{ count: number }> = (props) => {
  return (
    <div className="flex h-full items-center">
      <GroupIcon />
      <p>{numberInShorthand(props.count)}</p>
    </div>
  );
};

const ParticipationTrend: React.FC<{ trendPercent: number }> = (props) => {
  return (
    <Progress
      size="sm"
      radius="sm"
      classNames={{
        base: "max-w-md",
        track: "drop-shadow-md bg-rose-400",
        indicator: "bg-green-400",
      }}
      value={props.trendPercent}
    />
  );
};
