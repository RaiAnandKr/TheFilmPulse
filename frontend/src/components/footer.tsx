import { Button, Divider } from "@nextui-org/react";
import type { MenuItem } from "../schema/MenuItem";
import { FilmIcon } from "~/res/icons/film";
import { ContestIcon } from "~/res/icons/contest";
import { usePathname, useRouter } from "next/navigation";
import { findMaxMatchingRoute } from "~/utilities/findMaxMatchingRoute";
import { RedeemIcon } from "~/res/icons/redeem";
import { LOGIN_PATH } from "~/constants/paths";

const menuItems: MenuItem[] = [
  {
    key: "films",
    label: "Films",
    startIcon: <FilmIcon />,
    pathName: "/",
  },
  {
    key: "contests",
    label: "Contests",
    startIcon: <ContestIcon />,
    pathName: "/contests",
  },
  {
    key: "rewards",
    label: "Rewards",
    startIcon: <RedeemIcon />,
    pathName: "/rewards",
  },
];

export const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === LOGIN_PATH) {
    return null;
  }

  const pathList = menuItems.map((item) => item.pathName ?? "");

  return (
    <>
      <div className="flex p-7"></div>
      <div className="restrict-screen-width fixed bottom-0 z-50 flex h-14 w-full flex-none flex-col bg-white px-1 ">
        <Divider className="flex-none" />
        <div className="flex flex-auto items-center justify-between">
          {menuItems.map((item) => {
            const isActive =
              findMaxMatchingRoute(pathList, pathname ?? "") === item.pathName;
            return (
              <Button
                color={isActive ? "primary" : "default"}
                variant={isActive ? "flat" : "light"}
                key={item.key}
                className="flex-auto justify-evenly text-base font-bold"
                startContent={item.startIcon}
                onClick={() => item.pathName && router.push(item.pathName)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};
