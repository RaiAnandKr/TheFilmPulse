import {
  Slider,
  SliderProps,
  cn,
  type SliderStepMark,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { REWARDS, USER_COINS } from "~/constants/mocks";
import { CoinType } from "~/schema/CoinType";
import { gcdOfNumbers } from "~/utilities/gcdOfNumbers";

const SLIDER_ID = "RewardsMeter";

export const RewardsMeter = () => {
  const checkpointCount = REWARDS.length;
  const maxValue = REWARDS[checkpointCount - 1]?.checkpoint ?? 0;
  const step = gcdOfNumbers(REWARDS.map((reward) => reward.checkpoint));
  const userRedeemableCoins =
    USER_COINS.find((userCoin) => userCoin.type === CoinType.Earned)?.coins ??
    0;

  const [rewardPointer, setRewardPointer] = useState(userRedeemableCoins);
  const onChange = (value: number | number[]) => {
    typeof value === "number"
      ? setRewardPointer(value)
      : setRewardPointer(value[1] ?? 0);
  };

  const marks = useMemo(
    () => getMarks(userRedeemableCoins),
    [userRedeemableCoins],
  );

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
    />
  );
};

const getMarks = (userCoins: number) => {
  const marks: SliderStepMark[] = REWARDS.map((reward) => ({
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
      "top-[200%] text-primary font-bold",
    );
  }, []);
};
