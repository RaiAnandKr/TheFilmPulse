import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useMainStore } from "~/data/contexts/store-context";
import type { MenuItem } from "~/schema/MenuItem";
import { pick } from "~/utilities/pick";

const STATIC_MENU_ITEMS: MenuItem[] = [
  {
    key: "help",
    label: "Help & FAQs",
    pathName: "help",
  },
  {
    key: "contact",
    label: "Contact Us",
    pathName: "contact",
  },
];

export const useHeaderMenu = () => {
  const { handle: username } = useMainStore((state) => pick(state, ["handle"]));
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>(STATIC_MENU_ITEMS);

  const onMenuItemClick = useCallback(
    (item: MenuItem) => {
      if (item.onClick) {
        item.onClick();
        return;
      }

      if (item.pathName) {
        router.push(item.pathName);
      }
    },
    [router],
  );

  useEffect(() => {
    if (username) {
      setMenuItems([
        {
          key: "profile",
          label: `Your Profile (${username})`,
          btnColor: "primary",
          pathName: "profile",
        },
        ...STATIC_MENU_ITEMS,
      ]);
    } else {
      setMenuItems(STATIC_MENU_ITEMS);
    }
  }, [username]);

  return { onMenuItemClick, menuItems };
};
