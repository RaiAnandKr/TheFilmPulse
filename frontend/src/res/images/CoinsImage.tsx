import Coins from "~/res/images/Coins.png";
import { Image, cn } from "@nextui-org/react";

interface IconImageProps {
  flip?: boolean;
}

export const CoinsImage: React.FC<IconImageProps> = (props) => (
  <Image
    removeWrapper
    alt="Coins"
    height={24}
    width={24}
    src={Coins.src}
    radius="none"
    className={cn(props.flip ? "-scale-x-100" : "")}
  />
);
