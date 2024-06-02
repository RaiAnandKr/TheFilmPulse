"use client";
import { Tab, type TabItemProps, Tabs } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function PulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const tabItems: TabItemProps[] = [
    { key: "opinions", title: "Opinions" },
    { key: "predictions", title: "Predictions" },
  ];

  const selectedKey = useMemo(
    () =>
      tabItems.find((tabItem) => pathname?.includes(tabItem.key as string))
        ?.key as string,
    [pathname],
  );

  return (
    <div className="flex w-full flex-col bg-gradient-to-r from-green-100 to-rose-100 p-3">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        classNames={{
          tabContent: "group-data-[selected=true]:text-white font-bold",
          base: "pb-2",
          tabList: "border-teal-500",
        }}
        selectedKey={selectedKey}
        onSelectionChange={(key) => router.push(key as string)}
      >
        {tabItems.map((tabItem) => (
          <Tab {...tabItem} key={tabItem.key} />
        ))}
      </Tabs>
      {children}
    </div>
  );
}
