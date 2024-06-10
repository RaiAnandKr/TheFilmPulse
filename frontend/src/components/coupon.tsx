import { cn, Image } from "@nextui-org/react";
import styles from "./coupon.module.css";

interface CouponProps {
  couponLogoSrc: string;
}

export const Coupon: React.FC<CouponProps> = (props) => (
  <div
    className={cn(
      styles.coupon,
      "my-1 flex items-center justify-center bg-white p-1",
      "before:bg-default-100",
      "after:bg-default-100",
    )}
  >
    <Image alt="Coupon Logo" height={32} width={32} src={props.couponLogoSrc} />
  </div>
);
