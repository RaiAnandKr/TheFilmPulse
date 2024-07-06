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
  AvatarIcon,
} from "@nextui-org/react";
import { useState } from "react";
import styles from "./header.module.css";
import { BackIcon } from "~/res/icons/back";
import { usePathname, useRouter } from "next/navigation";
import { HOME_PATH, LOGIN_PATH } from "~/constants/paths";
import { CoinsImage } from "~/res/images/CoinsImage";
import { useLoadUserData } from "~/data/hooks/useLoadUserData";
import { numberInShorthand } from "~/utilities/numberInShorthand";
import { useHeaderMenu } from "~/hooks/useHeaderMenu";
import { userTotalCoinsSelector } from "~/data/store/selectors/userTotalCoinsSelector";

export const Header: React.FC = () => {
  const pathname = usePathname();
  return pathname === HOME_PATH ? <HomepageHeader /> : <SpokePageHeader />;
};

const HomepageHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="flex p-7"></div>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        isBlurred={false}
        classNames={{
          wrapper: "justify-between px-3 h-14",
          base: "fixed",
        }}
      >
        <NavbarContent as="div" className={styles.noflex} justify="start">
          <AvatarDropdown />
        </NavbarContent>

        <NavbarContent className="flex-auto" justify="center">
          <NavbarBrand className="h-full font-bold text-inherit">
            The Film Pulse
          </NavbarBrand>
        </NavbarContent>

        <LoginOrCoinsNavbarContent />
      </Navbar>
    </>
  );
};

const SpokePageHeader: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex p-7"></div>
      <Navbar
        isBordered
        isBlurred={false}
        classNames={{ wrapper: "justify-between px-3 h-14", base: "fixed" }}
      >
        <NavbarContent
          as="button"
          className={styles.noflex}
          justify="start"
          onClick={() => router.back()}
        >
          <BackIcon />
        </NavbarContent>

        <LoginOrCoinsNavbarContent />
      </Navbar>
    </>
  );
};

const LoginOrCoinsNavbarContent = () => {
  const router = useRouter();

  const { userTotalCoins, isLoggedIn } = useLoadUserData((state) => ({
    userTotalCoins: userTotalCoinsSelector(state),
    isLoggedIn: state.isUserLoggedIn,
  }));

  const pathname = usePathname();
  if (pathname === LOGIN_PATH) {
    return null;
  }

  const onCoinsClick = () => router.push("rewards");

  return (
    <NavbarContent className={styles.noflex} justify="end">
      <NavbarItem>
        {isLoggedIn ? (
          <Button
            variant="flat"
            startContent={<CoinsImage />}
            className="font-bold"
            color="warning"
            onPress={onCoinsClick}
          >
            {numberInShorthand(userTotalCoins)}
          </Button>
        ) : (
          <Button
            as={Link}
            variant="flat"
            className="font-bold"
            color="primary"
            href={LOGIN_PATH}
          >
            Login
          </Button>
        )}
      </NavbarItem>
    </NavbarContent>
  );
};

const AvatarDropdown = () => {
  const menuItems = useHeaderMenu();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          icon={<AvatarIcon />}
          isBordered
          as="button"
          size="sm"
          color="primary"
          classNames={{
            base: "bg-gradient-to-br from-success-300 to-danger-300",
            icon: "text-black/75",
          }}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        items={menuItems}
      >
        {(item) => (
          <DropdownItem key={item.key}>
            <Button
              color={item.btnColor}
              variant="light"
              size="lg"
              className="h-6 w-full justify-start px-0"
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};
