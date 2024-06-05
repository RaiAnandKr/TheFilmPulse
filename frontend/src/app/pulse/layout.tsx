"use client";

import { PulseTabs } from "~/components/pulse-tabs";

export default function PulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PulseTabs>{children}</PulseTabs>;
}
