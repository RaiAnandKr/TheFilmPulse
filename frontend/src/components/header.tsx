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
  type NavbarProps,
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
import { useMainStore } from "~/data/contexts/store-context";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePageHeader = pathname === HOME_PATH;
  const headerProps: HeaderBaseProps = isHomePageHeader
    ? {
        isMenuOpen: isMenuOpen,
        onMenuOpenChange: setIsMenuOpen,
        navbarContents: (
          <>
            <NavbarContent as="div" className={styles.noflex} justify="start">
              <AvatarDropdown />
            </NavbarContent>
            <NavbarContent className="flex-auto" justify="center">
              <NavbarBrand className="h-full font-bold text-inherit">
                The Film Pulse
              </NavbarBrand>
            </NavbarContent>
          </>
        ),
      }
    : {
        navbarContents: (
          <NavbarContent
            as="button"
            className={styles.noflex}
            justify="start"
            onClick={() => router.back()}
          >
            <BackIcon />
          </NavbarContent>
        ),
      };

  return <HeaderBase {...headerProps} />;
};

type HeaderBaseProps = NavbarProps & { navbarContents: JSX.Element };

const HeaderBase: React.FC<HeaderBaseProps> = (props) => {
  const { isMenuOpen, onMenuOpenChange, navbarContents } = props;
  return (
    <>
      <div className="flex p-7"></div>
      <Navbar
        isBordered
        isBlurred={false}
        classNames={{
          wrapper: "justify-between px-3 h-14",
          base: "fixed restrict-screen-width inset-x-auto",
        }}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={onMenuOpenChange}
      >
        {navbarContents}

        <LoginOrCoinsNavbarContent />
      </Navbar>
    </>
  );
};

const LoginOrCoinsNavbarContent = () => {
  const router = useRouter();
  const { userTotalCoins, isLoggedIn } = useMainStore((state) => ({
    userTotalCoins: userTotalCoinsSelector(state),
    isLoggedIn: state.isUserLoggedIn,
  }));

  useLoadUserData();

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
  const { menuItems, onMenuItemClick } = useHeaderMenu();

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
              onClick={() => onMenuItemClick(item)}
            >
              {item.label}
            </Button>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};
