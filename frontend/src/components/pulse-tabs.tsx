"use client";

import { useMemo } from "react";
import { Tab, type TabItemProps, Tabs } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

const TAB_ITEMS: TabItemProps[] = [
  { key: "contests", title: "Contests" },
  { key: "participations", title: "Your Participations" },
];

export const PulseTabs: React.FC<React.PropsWithChildren> = (props) => {
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey = useMemo(
    () =>
      TAB_ITEMS.find((tabItem) => pathname?.includes(tabItem.key as string))
        ?.key as string,
    [pathname],
  );

  return (
    <div className="bg-success-to-danger flex w-full flex-1 flex-col p-3">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        classNames={{
          tabContent: "group-data-[selected=true]:text-white font-bold",
          base: "pb-2",
          tabList: "border-teal-500 flex flex-grow",
        }}
        selectedKey={selectedKey}
        onSelectionChange={(key) => router.push(key as string)}
      >
        {TAB_ITEMS.map((tabItem) => (
          <Tab {...tabItem} key={tabItem.key} />
        ))}
      </Tabs>
      {props.children}
    </div>
  );
};
