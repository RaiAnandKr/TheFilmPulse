import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MainStoreProvider } from "~/data/contexts/store-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={(path) => router.push(path)}>
      <MainStoreProvider>{children}</MainStoreProvider>
    </NextUIProvider>
  );
}
