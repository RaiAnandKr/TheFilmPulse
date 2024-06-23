import {
  Slider,
  cn,
  type SliderStepMark,
  type SliderValue,
} from "@nextui-org/react";
import { useContext, useEffect, useMemo } from "react";
import { getRewards } from "~/constants/mocks";
import { RewardContext } from "~/data/contexts/reward-context";
import { useMainStore } from "~/data/contexts/store-context";
import { userEarnedCoinsSelector } from "~/data/store/selectors/userEarnedCoinsSelector";
import { gcdOfNumbers } from "~/utilities/gcdOfNumbers";

const SLIDER_ID = "RewardsMeter";

export const RewardsMeter = () => {
  const checkpointCount = getRewards().length;
  const maxValue = getRewards()[checkpointCount - 1]?.checkpoint ?? 0;
  const step = gcdOfNumbers(getRewards().map((reward) => reward.checkpoint));

  const userEarnedCoins = useMainStore(userEarnedCoinsSelector);

  const [rewardPointer, setRewardPointer] = useContext(RewardContext);
  const onChange = (value: SliderValue) => {
    setRewardPointer(getSliderValueInNumber(value));
  };

  const marks = useMemo(() => getMarks(userEarnedCoins), [userEarnedCoins]);

  useStyleUserMark();

  return (
    <Slider
      id={SLIDER_ID}
      size="md"
      label="Slide to reveal Rewards"
      showSteps
      showTooltip
      minValue={0}
      maxValue={maxValue}
      step={step}
      formatOptions={{ style: "decimal" }}
      marks={marks}
      classNames={{
        base: "max-w-md gap-3 h-20",
        filler:
          "bg-gradient-to-r from-green-300 to-rose-300 dark:from-green-600 dark:to-rose-800",
        step: "bg-default-400/50",
        value: "text-danger",
      }}
      renderThumb={({ index, ...props }) => (
        <div
          {...props}
          className="group top-1/2 cursor-grab rounded-full border-small border-default-200 bg-background p-1 shadow-medium data-[dragging=true]:cursor-grabbing dark:border-default-400/50"
        >
          <span
            className={cn(
              "block h-5 w-5 rounded-full bg-gradient-to-br shadow-small transition-transform group-data-[dragging=true]:scale-80",
              index === 0
                ? "from-green-200 to-green-500 dark:from-green-400 dark:to-green-600" // first thumb
                : "from-rose-200 to-rose-600 dark:from-rose-600 dark:to-rose-800",
            )}
          />
        </div>
      )}
      value={[0, rewardPointer]}
      onChange={onChange}
      getValue={(value: SliderValue) =>
        `Coins needed: ${Math.max(0, getSliderValueInNumber(value) - userEarnedCoins)}`
      }
    />
  );
};

const getMarks = (userCoins: number) => {
  const marks: SliderStepMark[] = getRewards().map((reward) => ({
    value: reward.checkpoint,
    label: reward.checkpoint.toString(),
  }));
  // add user coins in marks
  marks.push({
    value: userCoins,
    label: "You",
  });

  return marks;
};

const useStyleUserMark = () => {
  useEffect(() => {
    const markNodes = document.querySelectorAll<HTMLDivElement>(
      `#${SLIDER_ID} [data-slot="mark"]`,
    );
    const userMarkerNode = Array.from(markNodes).find(
      (markNode) => markNode.innerText === "You",
    );

    if (!userMarkerNode) {
      return;
    }

    userMarkerNode.className = cn(
      userMarkerNode.className,
      "top-[200%] text-primary font-bold opacity-100 mt-0",
      "before:w-0 before:h-0 before:border-x-[6px] before:border-b-[6px] before:border-x-transparent before:border-b-primary before:border-solid before:absolute before:top-[-110%] before:left-1/2 before:ml-[-6px]",
    );
  }, []);
};

const getSliderValueInNumber = (value: SliderValue) =>
  typeof value === "number" ? value : value[1] ?? 0;
