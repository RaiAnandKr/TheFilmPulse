"use client";

import { ContestTabs } from "~/components/contest-tabs";

const CONTEST_TAB_ITEMS = [
  { key: "live", title: "Live Contests" },
  { key: "participations", title: "Your Participations" },
];

export default function ContestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContestTabs tabItems={CONTEST_TAB_ITEMS}>{children}</ContestTabs>;
}
