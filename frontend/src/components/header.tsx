import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  Avatar,
} from "@nextui-org/react";
import { useState } from "react";
import type { MenuItem } from "../schema/MenuItem";
import { CoinIcon } from "../res/icons/coin";
import styles from "./header.module.css";
import { colors } from "../styles/colors";

const menuItems: MenuItem[] = [
  {
    key: "username",
    label: "Signed in as xyz_name",
  },
  {
    key: "redeem",
    label: "Reedem",
  },
  {
    key: "settings",
    label: "Settings",
  },
  {
    key: "help",
    label: "Help & Feedback",
  },
  {
    key: "logout",
    label: "Log Out",
    btnColor: "danger",
  },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      classNames={{ wrapper: "justify-between px-3 h-14" }}
    >
      <NavbarContent as="div" className={styles.noflex} justify="start">
        <AvatarDropdown />
      </NavbarContent>

      <NavbarContent className="flex-auto" justify="center">
        <NavbarBrand className="h-full font-bold text-inherit">
          The Film Pulse
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className={styles.noflex} justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            variant="flat"
            startContent={<CoinIcon />}
            className="font-bold"
            style={{
              color: colors.white,
              backgroundColor: colors.gold,
            }}
          >
            500
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

const AvatarDropdown = () => (
  <Dropdown placement="bottom-end">
    <DropdownTrigger>
      {/* TODO: changet to nextjs Image element */}
      <Avatar
        isBordered
        as="button"
        className="transition-transform"
        color="primary"
        name="Jason Hughes"
        size="sm"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
    </DropdownTrigger>
    <DropdownMenu aria-label="Profile Actions" variant="flat" items={menuItems}>
      {(item) => (
        <DropdownItem key={item.key}>
          <Button
            color={item.btnColor}
            variant="light"
            size="lg"
            className="h-6"
          >
            {item.label}
          </Button>
        </DropdownItem>
      )}
    </DropdownMenu>
  </Dropdown>
);
