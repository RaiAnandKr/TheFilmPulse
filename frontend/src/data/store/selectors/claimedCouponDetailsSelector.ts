import type { CouponDetail } from "~/schema/CouponDetail";
import type { RewardSlice } from "../rewards-slice";

export const claimedCouponDetailsSelector = (
  state: RewardSlice,
): CouponDetail[] => {
  const couponDetails: CouponDetail[] = [];
  for (const couponId of state.claimedCoupons.keys()) {
    const couponDetail = state.getCouponDetail(couponId);
    if (couponDetail) couponDetails.push(couponDetail);
  }

  return couponDetails;
};
