import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { LOGIN_PATH } from "~/constants/paths";
import { useMainStore } from "~/data/contexts/store-context";

export const useDisclosureWithLogin = () => {
  const disclosure = useDisclosure();

  const isUserLoggedIn = useMainStore((state) => state.isUserLoggedIn);
  const router = useRouter();

  const onOpen = () => {
    if (isUserLoggedIn) {
      disclosure.onOpen();
    } else {
      router.push(LOGIN_PATH);
    }
  };

  return { ...disclosure, onOpen };
};
