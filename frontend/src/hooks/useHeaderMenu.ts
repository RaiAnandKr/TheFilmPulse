import { useEffect, useState } from "react";
import { useMainStore } from "~/data/contexts/store-context";
import type { MenuItem } from "~/schema/MenuItem";
import { pick } from "~/utilities/pick";

const STATIC_MENU_ITEMS = [
  {
    key: "help",
    label: "Help",
  },
  {
    key: "contact",
    label: "Contact Us",
  },
];

export const useHeaderMenu = () => {
  const { handle: username, removeUserState } = useMainStore((state) =>
    pick(state, ["handle", "removeUserState"]),
  );

  const [menuItems, setMenuItems] = useState<MenuItem[]>(STATIC_MENU_ITEMS);

  useEffect(() => {
    if (username) {
      setMenuItems([
        {
          key: "username",
          label: `Your Profile (${username})`,
          btnColor: "primary",
        },
        ...STATIC_MENU_ITEMS,
        {
          key: "logout",
          label: "Logout",
          btnColor: "danger",
          onClick: () => {
            // TODO: remove user cookie
            removeUserState();
          },
        },
      ]);
    } else {
      setMenuItems(STATIC_MENU_ITEMS);
    }
  }, [username]);

  return menuItems;
};
