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
import { BackIcon } from "~/res/icons/back";
import { usePathname, useRouter } from "next/navigation";
import { HOME_PATH } from "~/constants/paths";

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
  const pathname = usePathname();
  return pathname === HOME_PATH ? <HomepageHeader /> : <SpokePageHeader />;
};

const HomepageHeader: React.FC = () => {
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

      <LoginCumCoinsNavbarContent />
    </Navbar>
  );
};

const SpokePageHeader: React.FC = () => {
  const router = useRouter();

  return (
    <Navbar
      isBordered
      isBlurred={false}
      classNames={{ wrapper: "justify-between px-3 h-14" }}
    >
      <NavbarContent
        as="button"
        className={styles.noflex}
        justify="start"
        onClick={() => router.back()}
      >
        <BackIcon />
      </NavbarContent>

      <LoginCumCoinsNavbarContent />
    </Navbar>
  );
};

const LoginCumCoinsNavbarContent = () => (
  <NavbarContent className={styles.noflex} justify="end">
    <NavbarItem className="hidden lg:flex">
      <Link href="#">Login</Link>
    </NavbarItem>
    <NavbarItem>
      <Button
        variant="flat"
        startContent={<CoinIcon />}
        className="font-bold"
        color="warning"
      >
        500
      </Button>
    </NavbarItem>
  </NavbarContent>
);

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
