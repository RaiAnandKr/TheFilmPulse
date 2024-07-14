import { Button, cn, Image, useDisclosure } from "@nextui-org/react";
import styles from "./coupon.module.css";
import type { CouponDetail } from "~/schema/CouponDetail";
import { CouponDisclosure } from "./coupon-disclosure";
import { CouponMode } from "~/schema/CouponMode";

interface CouponProps {
  coupon: CouponDetail;
  isDisabled?: boolean;
  mode?: CouponMode;
}

export const Coupon: React.FC<CouponProps> = (props) => {
  const { isDisabled, coupon, mode = CouponMode.New } = props;
  const disclosure = useDisclosure();

  return (
    <div
      className={cn(
        styles.couponContainer,
        "my-1 flex justify-start gap-2",
        mode === CouponMode.New && "w-full",
      )}
    >
      <Button
        className={cn(
          styles.coupon,
          "flex flex-none items-center justify-center bg-white p-1 px-2",
          "before:bg-default-100 after:bg-default-100", // coupon's parent element color to give round cut out effect
        )}
        isDisabled={isDisabled}
        onPress={disclosure.onOpen}
        radius="none"
      >
        <Image
          alt="Coupon Logo"
          src={coupon.couponLogoSrc}
          radius="none"
          removeWrapper
          className="flex h-full w-full object-contain"
        />
      </Button>
      {mode === CouponMode.New && (
        <p
          className={cn(
            styles.couponInfo,
            "flex-auto overflow-hidden rounded-sm border-2 border-dashed border-default-300 p-1 text-tiny text-default-500",
          )}
        >
          {coupon.couponInfo}
        </p>
      )}
      <CouponDisclosure {...disclosure} {...coupon} mode={mode} />
    </div>
  );
};
