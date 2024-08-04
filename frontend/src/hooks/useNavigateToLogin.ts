import { usePathname, useRouter } from "next/navigation";
import { useCreateQueryString } from "./useCreateQueryString";
import { useCallback } from "react";
import { HOME_PATH, LOGIN_PATH, REFERRER_PARAM } from "~/constants/paths";

export const useNavigateToLogin = () => {
  const createQueryString = useCreateQueryString();
  const pathname = usePathname();

  const router = useRouter();

  const navigateToLogin = useCallback(() => {
    const pathWithQueryParams = `${LOGIN_PATH}?${createQueryString(REFERRER_PARAM, pathname ?? HOME_PATH)}`;
    router.push(pathWithQueryParams);
  }, [router, pathname, createQueryString]);

  return navigateToLogin;
};
