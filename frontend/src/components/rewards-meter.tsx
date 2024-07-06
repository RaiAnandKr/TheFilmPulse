import {
  Slider,
  cn,
  type SliderStepMark,
  type SliderValue,
} from "@nextui-org/react";
import { useContext, useEffect, useMemo, type DependencyList } from "react";
import { RewardContext } from "~/data/contexts/reward-context";
import { useMainStore } from "~/data/contexts/store-context";
import type { MainStore } from "~/data/store/main-store";
import { userEarnedCoinsSelector } from "~/data/store/selectors/userEarnedCoinsSelector";
import { gcdOfNumbers } from "~/utilities/gcdOfNumbers";

const SLIDER_ID = "RewardsMeter";

export const RewardsMeter = () => {
  const { maxValue, checkpoints, userEarnedCoins, userMaxRedeemableCoins } =
    useMainStore((state) => ({
      maxValue: state.rewards.length
        ? state.rewards[state.rewards.length - 1]?.checkpoint ?? 0
        : 0,
      checkpoints: state.rewards.map((reward) => reward.checkpoint),
      userEarnedCoins: userEarnedCoinsSelector(state),
      userMaxRedeemableCoins: maxRedeemableCoinsSelector(state),
    }));

  const [rewardPointer, setRewardPointer] = useContext(RewardContext);

  useEffect(
    () => {
      const defaultValue = Math.max(
        userMaxRedeemableCoins,
        checkpoints[0] ?? 0,
      );
      setRewardPointer(defaultValue);
    },
    // "maxValue" is initialized with 0 and changes when we have rewards data,
    // hence is used to initialise reward pointer then.
    [setRewardPointer, maxValue],
  );

  const onChange = (value: SliderValue) => {
    setRewardPointer(getSliderValueInNumber(value));
  };

  const step = useMemo(() => gcdOfNumbers(checkpoints), [checkpoints]);
  const marks = useMemo(
    () => getMarks(userEarnedCoins, checkpoints, maxValue),
    [userEarnedCoins, checkpoints, maxValue],
  );

  useStyleUserMark([marks]);

  if (!maxValue) {
    return null;
  }

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

const getMarks = (
  userCoins: number,
  checkpoints: number[],
  maxRewardCheckpoint: number,
) => {
  const marks: SliderStepMark[] = checkpoints.map((checkpoint) => ({
    value: checkpoint,
    label: checkpoint.toString(),
  }));

  // add user coins in marks
  marks.push({
    value: Math.min(userCoins, maxRewardCheckpoint),
    label: "You",
  });

  return marks;
};

const useStyleUserMark = (dependencies?: DependencyList) => {
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
  }, dependencies);
};

const getSliderValueInNumber = (value: SliderValue) =>
  typeof value === "number" ? value : value[1] ?? 0;

const maxRedeemableCoinsSelector = (state: MainStore) => {
  const earnedCoins = userEarnedCoinsSelector(state);
  return state.rewards.reduce((maxRedeemableCoins, reward) => {
    if (reward.checkpoint > earnedCoins) {
      return maxRedeemableCoins;
    }

    return Math.max(reward.checkpoint, maxRedeemableCoins);
  }, 0);
};
