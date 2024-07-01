import type { StateCreator } from "zustand";
import type { CouponCode, CouponDetail } from "~/schema/CouponDetail";
import type { Reward } from "~/schema/Reward";

type RewardState = {
  rewards: Reward[];
  claimedCoupons: Map<CouponDetail["couponId"], CouponCode[]>;
};

type RewardAction = {
  setRewards: (rewards: Reward[]) => void;
  getCouponDetail: (
    couponId: CouponDetail["couponId"],
  ) => CouponDetail | undefined;
  updateClaimedCoupon: (
    couponId: CouponDetail["couponId"],
    claimedCode: CouponCode,
  ) => void;
};

export type RewardSlice = RewardState & RewardAction;

export const createRewardSlice: StateCreator<
  RewardSlice,
  [["zustand/devtools", never]],
  [],
  RewardSlice
> = (set, get) => ({
  rewards: [],
  claimedCoupons: new Map(),
  getCouponDetail: (couponId) => {
    for (const reward of get().rewards) {
      const matchingCoupon = reward.coupons.find(
        (coupon) => coupon.couponId === couponId,
      );

      if (matchingCoupon) {
        return matchingCoupon;
      }
    }

    return undefined;
  },
  setRewards: (rewards) =>
    set(
      {
        rewards,
      },
      false,
      "RewardAction/setRewards",
    ),
  updateClaimedCoupon: (couponId, claimedCode) =>
    set(
      (state) => {
        const updatedClaimedCoupons = new Map(state.claimedCoupons);
        const matchingCouponCodeIndex = updatedClaimedCoupons
          .get(couponId)
          ?.findIndex((couponCode) => couponCode.codeId === claimedCode.codeId);

        switch (matchingCouponCodeIndex) {
          case undefined:
            updatedClaimedCoupons.set(couponId, [claimedCode]);
            break;
          case -1:
            updatedClaimedCoupons.get(couponId)!.push(claimedCode);
            break;
          default:
            updatedClaimedCoupons
              .get(couponId)!
              .splice(matchingCouponCodeIndex, 1, claimedCode);
            break;
        }

        return { claimedCoupons: updatedClaimedCoupons };
      },
      false,
      { type: "RewardAction/updateClaimedCoupons", couponId },
    ),
});
