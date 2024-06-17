import Coins from "~/res/images/Coins.png";
import { Image } from "@nextui-org/react";

export const CoinsImage = () => (
  <Image
    removeWrapper
    alt="Coins"
    height={24}
    width={24}
    src={Coins.src}
    radius="none"
  />
);
