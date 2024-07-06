import { useDisclosure } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { HOME_PATH, LOGIN_PATH, REFERRER_PARAM } from "~/constants/paths";
import { useMainStore } from "~/data/contexts/store-context";
import { useCreateQueryString } from "./useCreateQueryString";

export const useDisclosureWithLogin = () => {
  const disclosure = useDisclosure();
  const createQueryString = useCreateQueryString();
  const pathname = usePathname();

  const isUserLoggedIn = useMainStore((state) => state.isUserLoggedIn);
  const router = useRouter();

  const onOpen = () => {
    if (isUserLoggedIn) {
      disclosure.onOpen();
    } else {
      const pathWithQueryParams = `${LOGIN_PATH}?${createQueryString(REFERRER_PARAM, pathname ?? HOME_PATH)}`;
      router.push(pathWithQueryParams);
    }
  };

  return { ...disclosure, onOpen };
};
