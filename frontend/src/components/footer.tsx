import { Button, Divider } from "@nextui-org/react";
import type { MenuItem } from "../schema/MenuItem";
import { FilmIcon } from "~/res/icons/film";
import { PulseIcon } from "~/res/icons/pulse";
import { DashboardIcon } from "~/res/icons/dashboard";
import { usePathname, useRouter } from "next/navigation";

const menuItems: MenuItem[] = [
  {
    key: "film",
    label: "Film",
    startIcon: <FilmIcon />,
    pathName: "/",
  },
  {
    key: "pulse",
    label: "Pulse",
    startIcon: <PulseIcon />,
    pathName: "/pulse",
  },
  {
    key: "dashboard",
    label: "Dashboard",
    startIcon: <DashboardIcon />,
    pathName: "/dashboard",
  },
];

export const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-none flex-col">
      <Divider />
      <div className="flex">
        {menuItems.map((item) => {
          const isActive = pathname === item.pathName;
          return (
            <Button
              color={isActive ? "primary" : "default"}
              variant={isActive ? "flat" : "light"}
              key={item.key}
              className="flex-auto justify-evenly font-bold"
              startContent={item.startIcon}
              onClick={() => item.pathName && router.push(item.pathName)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
