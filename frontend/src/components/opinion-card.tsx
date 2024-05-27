import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Slider,
} from "@nextui-org/react";
import type { OpinionOption, UserVote } from "../schema/Opinion";
import { CoinIcon } from "../res/icons/coin";

interface OpinionProps {
  title: string;
  daysToEnd: number;
  options: {
    key: OpinionOption;
    label: string;
    color: "success" | "danger";
    icon: JSX.Element;
  }[];
  userVote?: UserVote;
}

type OptionsProps = Pick<OpinionProps, "options" | "userVote">;

export const OpinionCard: React.FC<OpinionProps> = (props) => {
  const { title, daysToEnd } = props;

  return (
    <Card className="h-50 m-3 w-72">
      <CardBody className="p-3.5 text-base">
        <p>{title}</p>
      </CardBody>
      <CardFooter className="flex flex-none flex-col">
        <p>
          <span className="text-small font-semibold text-default-400">
            Ends in:
          </span>
          <span className=" text-small text-default-400">
            {` ${daysToEnd} days`}
          </span>
        </p>
        <Options {...props} />
      </CardFooter>
    </Card>
  );
};

const Options: React.FC<OptionsProps> = (props) => {
  const { options, userVote } = props;

  return (
    <div className="flex w-full justify-evenly pt-2">
      {options.map((option) => {
        const hasUserVoted = !!userVote;
        const isUserVotedOption =
          hasUserVoted && userVote.selectedOption === option.key;

        return (
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
                      classNames={{ value: "text-teal-500 font-bold" }}
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
        );
      })}
    </div>
  );
};
