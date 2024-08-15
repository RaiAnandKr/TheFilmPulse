"use client";

import { PulseTabs } from "~/components/pulse-tabs";

const PULSE_TAB_ITEMS = [
  { key: "live", title: "Live Contests" },
  { key: "participations", title: "Your Participations" },
];

export default function PulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PulseTabs tabItems={PULSE_TAB_ITEMS}>{children}</PulseTabs>;
}
