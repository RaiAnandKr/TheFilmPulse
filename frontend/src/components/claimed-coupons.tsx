import { useMainStore } from "~/data/contexts/store-context";
import { Coupon } from "./coupon";
import type { CouponDetail } from "~/schema/CouponDetail";
import { CouponMode } from "~/schema/CouponMode";
import { claimedCouponDetailsSelector } from "~/data/store/selectors/claimedCouponDetailsSelector";
import { useLoadData } from "~/data/hooks/useLoadData";
import { getClaimedCoupons } from "~/service/apiUtils";

export const ClaimedCoupons = () => {
  const { couponDetails, updateClaimedCoupon } = useMainStore((state) => ({
    couponDetails: claimedCouponDetailsSelector(state),
    updateClaimedCoupon: state.updateClaimedCoupon,
  }));

  useLoadData("getClaimedCoupons", getClaimedCoupons, (claimedCoupons) => {
    claimedCoupons.forEach(({ couponId, couponCodes }) =>
      couponCodes.forEach((couponCode) =>
        updateClaimedCoupon(couponId, couponCode),
      ),
    );
  });

  return (
    <div className="flex w-full flex-none flex-col bg-default-100 p-3">
      {couponDetails.length ? (
        <CouponsList coupons={couponDetails} />
      ) : (
        <NoCoupons />
      )}
    </div>
  );
};

const CouponsList: React.FC<{ coupons: CouponDetail[] }> = (props) => (
  <>
    <p className="p-1 text-tiny text-default-400">
      Tap on card to reveal code. Swipe to see more.
    </p>
    <div className="flex justify-start gap-2 overflow-x-auto">
      {props.coupons.map((coupon) => (
        <Coupon
          key={coupon.couponId}
          coupon={coupon}
          mode={CouponMode.Claimed}
        />
      ))}
    </div>
  </>
);

const NoCoupons = () => (
  <p className="text-tiny text-danger">No Coupons Claimed!</p>
);
