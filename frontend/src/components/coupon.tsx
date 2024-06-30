import { Button, cn, Image, useDisclosure } from "@nextui-org/react";
import styles from "./coupon.module.css";
import type { CouponDetail } from "~/schema/CouponDetail";
import { CouponDisclosure } from "./coupon-disclosure";

interface CouponProps {
  coupon: CouponDetail;
  isDisabled?: boolean;
}

export const Coupon: React.FC<CouponProps> = (props) => {
  const { isDisabled, coupon } = props;
  const disclosure = useDisclosure();

  return (
    <div
      className={cn(styles.couponContainer, "my-1 flex w-full justify-start")}
    >
      <Button
        className={cn(
          styles.coupon,
          "mr-2 flex flex-none items-center justify-center bg-white p-2",
          "before:bg-default-100 after:bg-default-100", // coupon's parent element color to give round cut out effect
        )}
        isDisabled={isDisabled}
        onPress={disclosure.onOpen}
      >
        <Image
          alt="Coupon Logo"
          height={32}
          width={32}
          src={coupon.couponLogoSrc}
          radius="none"
        />
      </Button>
      <p
        className={cn(
          styles.couponInfo,
          "flex-auto overflow-hidden rounded-sm border-2 border-dashed border-default-300 p-1 text-tiny text-default-500",
        )}
      >
        {coupon.couponInfo}
      </p>
      <CouponDisclosure {...disclosure} {...coupon} />
    </div>
  );
};
