import { Coupon } from "./coupon";
import { getRewards } from "~/constants/mocks";
import { RewardsMeter } from "./rewards-meter";
import { RewardContext, RewardProvider } from "~/data/contexts/reward-context";
import { useContext } from "react";
import { userEarnedCoinsSelector } from "~/data/store/selectors/userEarnedCoinsSelector";
import { useMainStore } from "~/data/contexts/store-context";

export const Rewards = () => {
  return (
    <RewardProvider>
      <div className="flex h-full w-full flex-col bg-default-100 p-3">
        <RewardsMeter />

        <p className="p-1 text-tiny text-default-400">
          Tap on coupon card to claim.
        </p>

        <Coupons />
      </div>
    </RewardProvider>
  );
};

const Coupons = () => {
  const [rewardPointer] = useContext(RewardContext);

  const userEarnedCoins = useMainStore(userEarnedCoinsSelector);

  const eligibleCoupons = getRewards().find(
    (reward) => reward.checkpoint === rewardPointer,
  )?.coupons;

  if (!eligibleCoupons) {
    return (
      <p className="text-center text-sm text-danger-500">
        No coupons available.
      </p>
    );
  }

  const isCouponDisabled = userEarnedCoins < rewardPointer;

  return eligibleCoupons.map((coupon) => (
    <Coupon
      key={coupon.couponId}
      coupon={coupon}
      isDisabled={isCouponDisabled}
    />
  ));
};
