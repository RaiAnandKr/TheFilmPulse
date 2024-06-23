import type { CouponDetail } from "./CouponDetail";

export interface Reward {
  checkpoint: number;
  coupons: CouponDetail[];
}
