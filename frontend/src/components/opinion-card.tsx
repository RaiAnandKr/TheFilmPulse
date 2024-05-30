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
} from "@nextui-org/react";
import { OpinionOption, UserVote } from "../schema/Opinion";
import { CoinIcon } from "../res/icons/coin";
import { TimerAndParticipations } from "./timer-and-participations";
import { numberInShorthand } from "../utilities/numberInShorthand";

interface OpinionProps {
  title: string;
  endDate: string;
  options: {
    key: OpinionOption;
    label: string;
    color: "success" | "danger";
    icon: JSX.Element;
    votes: number;
    coins: number;
  }[];
  userVote?: UserVote;
}

type OptionsProps = Pick<OpinionProps, "options" | "userVote">;
type ParticipationTrendProps = Pick<OpinionProps, "options">;

export const OpinionCard: React.FC<OpinionProps> = (props) => {
  const { title, endDate, options } = props;

  const totalParticipations = options.reduce(
    (acc, option) => acc + option.votes,
    0,
  );

  return (
    <Card className="h-50 m-2 w-72 p-2.5" isBlurred>
      {/** Remember to change parent width if you change card width from w-72. */}
      <CardHeader className="flex items-start justify-between p-0 pb-2">
        <Image
          alt="nextui logo"
          height={42}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={42}
          className="max-w-16"
        />
        <TimerAndParticipations
          endDate={endDate}
          totalParticipations={totalParticipations}
        />
      </CardHeader>
      <CardBody className="p-0 py-2 text-sm">
        <p>{title}</p>
      </CardBody>
      <CardFooter className="flex flex-none flex-col p-0 pt-2">
        <ParticipationTrend options={options} />
        <Options {...props} />
      </CardFooter>
    </Card>
  );
};

const Options: React.FC<OptionsProps> = (props) => {
  const { options, userVote } = props;

  return (
    <div className="flex w-full justify-between pt-2.5">
      {options.map((option, index) => {
        const hasUserVoted = !!userVote;
        const isUserVotedOption =
          hasUserVoted && userVote.selectedOption === option.key;

        const popoverContentBgColorClass =
          option.key === OpinionOption.Yes ? "bg-green-200" : "bg-rose-200";

        const popoverContentTextColorClass =
          option.key === OpinionOption.Yes ? "text-green-500" : "text-rose-500";

        return (
          <>
            <Popover placement="bottom" showArrow offset={10} key={option.key}>
              <PopoverTrigger>
                <Button
                  isDisabled={hasUserVoted}
                  variant={hasUserVoted ? "flat" : "bordered"}
                  color={option.color}
                  key={option.key}
                  fullWidth
                  className="mx-1"
                  startContent={isUserVotedOption ? <CoinIcon /> : option.icon}
                >
                  {isUserVotedOption ? userVote.coinsUsed : option.label}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[240px] p-2.5 ${popoverContentBgColorClass}`}
              >
                {(titleProps) => (
                  <div
                    className={`flex w-full flex-col items-center ${popoverContentTextColorClass}`}
                  >
                    <p className="w-ful h-full font-bold">{option.label}</p>
                    <div className="mt-2 flex w-full flex-col rounded-lg border-2 border-white bg-white p-3">
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
          </>
        );
      })}
    </div>
  );
};

const ParticipationTrend: React.FC<ParticipationTrendProps> = (props) => {
  const { options } = props;
  const coinsOnLike = options.at(0)?.coins ?? 0;
  const coinsOnDislike = options.at(1)?.coins ?? 0;
  const totalCoins = coinsOnLike + coinsOnDislike;
  const coinsOnLikePercent = (coinsOnLike * 100) / totalCoins;

  return (
    <Progress
      size="sm"
      radius="sm"
      classNames={{
        base: "max-w-md",
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
