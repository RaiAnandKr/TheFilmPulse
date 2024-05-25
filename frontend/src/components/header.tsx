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
import { AcmeLogo } from "../res/icons/brandLogo";
import { useState } from "react";
import type { MenuItem } from "../schema/MenuItem";
import { CoinsIcon } from "../res/icons/coinsIcon";

const menuItems: MenuItem[] = [
  {
    key: "username",
    label: "Signed in as xyz_name",
  },
  {
    key: "dashboard",
    label: "Dashboard",
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

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent as="div" className="noflex" justify="start">
        <AvatarDropdown />
      </NavbarContent>

      <NavbarContent className="flex-auto sm:hidden" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="noflex" justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button color="success" variant="flat" startContent={<CoinsIcon />}>
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
