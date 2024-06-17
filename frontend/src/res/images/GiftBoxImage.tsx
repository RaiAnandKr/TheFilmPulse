import GiftBox from "~/res/images/GiftBox.png";
import { Image } from "@nextui-org/react";

export const GiftBoxImage = () => (
  <Image
    removeWrapper
    alt="Gift Box"
    height={24}
    width={24}
    src={GiftBox.src}
    radius="none"
  />
);
