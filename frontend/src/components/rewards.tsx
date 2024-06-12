import { Coupon } from "./coupon";
import { REWARDS } from "~/constants/mocks";
import { RewardsMeter } from "./rewards-meter";

export const Rewards = () => {
  return (
    <div className="flex h-full w-full flex-col bg-default-100 p-3">
      <RewardsMeter />

      <p className="p-1 text-tiny text-default-400">
        Tap on coupon card to claim.
      </p>

      {REWARDS[0]?.coupons.map((coupon) => (
        <Coupon key={coupon.id} coupon={coupon} />
      ))}
    </div>
  );
};
