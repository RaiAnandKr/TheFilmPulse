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
  CardHeader,
  Image,
  cn,
} from "@nextui-org/react";
import { type Vote, type Opinion, type UserVote } from "../schema/Opinion";
import { OpinionOption } from "~/schema/OpinionOption";
import { CoinIcon } from "../res/icons/coin";
import { TimerAndParticipations } from "./timer-and-participations";
import { numberInShorthand } from "../utilities/numberInShorthand";
import { LikeIcon } from "~/res/icons/like";
import { DislikeIcon } from "~/res/icons/dislike";
import { useRouter } from "next/navigation";
import { ResultChip } from "./result-chip";
import { useState } from "react";
import { getUserEarnedCoins } from "~/constants/mocks";

interface OpinionProps {
  opinion: Opinion;
  useFullWidth?: boolean;
  useFooter?: boolean;
}

export const OpinionCard: React.FC<OpinionProps> = (props) => {
  const { useFullWidth, opinion, useFooter } = props;
  const { title, endDate, filmPosterSrc, votes, userVote, filmId, result } =
    opinion;

  const router = useRouter();

  const onFilmPosterClick = () => {
    router.push(`/film/${filmId}/opinions`);
  };

  const totalParticipations = votes.reduce(
    (acc, vote) => acc + vote.participationCount,
    0,
  );

  const cardClassName = useFullWidth
    ? "h-50 p-2.5 my-2 w-full"
    : "h-50 p-2.5 m-2 w-72"; // Remember to change parent width if you change card width from w-72.

  return (
    <Card className={cardClassName} isBlurred>
      {!useFooter && (
        <CardHeader className="flex flex-col items-start p-0 pb-2">
          <ResultChip
            endDate={endDate}
            hasUserParticipated={!!userVote}
            result={result}
          />
          <div className="flex w-full items-start justify-between">
            <Button isIconOnly radius="sm" onClick={onFilmPosterClick}>
              <Image
                alt="Film Poster"
                height={48}
                src={
                  filmPosterSrc ??
                  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                }
                width={48}
                className="max-h-12 max-w-12"
              />
            </Button>
            <TimerAndParticipations
              endDate={endDate}
              totalParticipations={totalParticipations}
            />
          </div>
        </CardHeader>
      )}
      <CardBody className="p-0 py-2 text-sm">
        <p>{title}</p>
      </CardBody>
      <CardFooter className="flex flex-none flex-col p-0 pt-2">
        <ParticipationTrend votes={votes} />
        <Options votes={votes} userVote={userVote} />
        {useFooter && (
          <TimerAndParticipations
            endDate={endDate}
            totalParticipations={totalParticipations}
            showInRow
          />
        )}
      </CardFooter>
    </Card>
  );
};

const Options: React.FC<{ votes: Vote[]; userVote?: UserVote }> = (props) => {
  const { votes, userVote } = props;

  return (
    <div className="flex w-full justify-between pb-1 pt-2.5">
      <Option
        key={votes[0]?.option ?? OpinionOption.Yes}
        option={votes[0]?.option ?? OpinionOption.Yes}
        icon={<LikeIcon />}
        classNames={{
          color: "success",
          popoverContentBgColorClass: "bg-green-200",
          popoverContentTextColorClass: "text-green-500",
        }}
        votes={votes}
        userVote={userVote}
      />
      <Option
        key={votes[1]?.option ?? OpinionOption.No}
        option={votes[1]?.option ?? OpinionOption.No}
        icon={<DislikeIcon />}
        classNames={{
          color: "danger",
          popoverContentBgColorClass: "bg-rose-200",
          popoverContentTextColorClass: "text-rose-500",
        }}
        votes={votes}
        userVote={userVote}
      />
    </div>
  );
};

const ParticipationTrend: React.FC<{ votes: Vote[] }> = (props) => {
  const { votes } = props;
  const coinsOnLike = votes.at(0)?.coins ?? 0;
  const coinsOnDislike = votes.at(1)?.coins ?? 0;
  const totalCoins = coinsOnLike + coinsOnDislike;
  const coinsOnLikePercent = (coinsOnLike * 100) / totalCoins;

  return (
    <Progress
      size="sm"
      radius="sm"
      classNames={{
        base: "max-w-md gap-1",
        track: "drop-shadow-md bg-rose-400 mx-1",
        indicator: "bg-green-400",
      }}
      value={coinsOnLikePercent}
      label={<Coins coins={coinsOnLike} colorClass="text-green-400" />}
      valueLabel={<Coins coins={coinsOnDislike} colorClass="text-rose-400" />}
      showValueLabel
    />
  );
};

const Coins: React.FC<{
  coins: number;
  iconAtEnd?: boolean;
  colorClass?: string;
}> = (props) => (
  <div
    className={`flex items-center text-nowrap px-2 text-small text-default-400 ${props.colorClass}`}
    style={{
      flexDirection: props.iconAtEnd ? "row-reverse" : "row",
    }}
  >
    <CoinIcon />
    <p> &nbsp; {numberInShorthand(props.coins)} </p>
  </div>
);

interface OptionProps {
  option: OpinionOption;
  classNames: {
    color: "success" | "danger";
    popoverContentBgColorClass: "bg-green-200" | "bg-rose-200";
    popoverContentTextColorClass: "text-green-500" | "text-rose-500";
  };
  icon: JSX.Element;
  votes: Vote[];
  userVote?: UserVote;
}

const Option: React.FC<OptionProps> = (props) => {
  const { userVote, votes, option, classNames, icon } = props;
  const label = option;

  const earnedCoins = getUserEarnedCoins();
  const defaultCoinsToBet = Math.floor(earnedCoins * 0.3);
  const [coinstToBet, setCoinsToBet] = useState(defaultCoinsToBet);

  const onSliderChange = (value: number | number[]) => {
    const newValue = typeof value === "number" ? value : value[0] ?? 0;
    setCoinsToBet(newValue);
  };

  const hasUserVoted = !!userVote;
  const isUserVotedOption = hasUserVoted && userVote.selectedOption === option;
  const expectedRewardCoins = getExpectedRewardCoins(
    votes,
    option,
    coinstToBet,
  );

  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <Button
          isDisabled={hasUserVoted}
          variant={hasUserVoted ? "flat" : "bordered"}
          color={classNames.color}
          fullWidth
          className="mx-1"
          startContent={isUserVotedOption ? <CoinIcon /> : icon}
        >
          {isUserVotedOption ? userVote.coinsUsed : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[260px] p-2.5", classNames.popoverContentBgColorClass)}
      >
        {(_) => (
          <div
            className={cn(
              "flex w-full flex-col items-center",
              classNames.popoverContentTextColorClass,
            )}
          >
            <p className="w-ful h-full font-bold">{label}</p>
            <div className="mt-2 flex w-full flex-col rounded-lg border-2 border-white bg-white p-3 text-black">
              <Slider
                label="Select Coins"
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
              <p className="flex justify-between py-2 font-bold text-success">
                <span>Expected Coins on win:</span>
                <span>+{expectedRewardCoins}</span>
              </p>
              <Button variant="solid" color="secondary" className="font-bold">
                Confirm
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
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
