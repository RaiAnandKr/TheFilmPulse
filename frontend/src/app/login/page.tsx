"use client";

import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { OtplessLogin, type OtplessUser } from "~/components/otpless-login";
import { HOME_PATH, REFERRER_PARAM } from "~/constants/paths";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadDataConfig } from "~/data/hooks/useLoadData";
import { CloseIcon } from "~/res/icons/close";
import { CoinType } from "~/schema/CoinType";
import type { UserResponse } from "~/schema/User";
import { post } from "~/service/apiUtils";

// TODO: don't let user route to login page if user is already logged in.
const LoginPageBase = () => {
  const { loginFailureMessage, setLoginFailureMessage, onUserInfoLoad } =
    useLoginHandler();

  // We are actually tracking an "attempt to login" event but that's not one of
  // the standard events in FB pixel. "Search" looked like the nearest suitable
  // one.
  // window.fbq might be None if the pixel hasn't been initiated in the root layout and
  // hence checking its value for safety.
  // Using hasTrackedSearchEvent to make sure we do the tracking only once per session.
  // "@ts-expect-error": I know this works in testing. There is a better ts way to do it, but
  // I am a noob so excuse me.
  if (
    typeof window !== "undefined" &&
    (window as any).fbq &&
    !(window as any).hasTrackedSearchEvent
  ) {
    // @ts-expect-error: I know this works in testing.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.fbq("track", "Search");
    // @ts-expect-error: I know this works in testing.
    window.hasTrackedSearchEvent = true;
  }

  return (
    <div className="bg-success-to-danger flex h-full flex-col justify-center gap-4 p-6">
      {loginFailureMessage && (
        <div className="flex justify-between rounded-lg border-2 border-danger bg-danger-100 font-semibold text-danger">
          <p className="p-2">{loginFailureMessage}</p>
          <Button
            isIconOnly
            variant="light"
            color="danger"
            onClick={() => setLoginFailureMessage(null)}
          >
            <CloseIcon />
          </Button>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 ">
        <h2 className="text-3xl font-semibold text-danger">The Film Pulse</h2>
        <p className="text-3xl font-bold">Sign in</p>
      </div>

      <OtplessLogin onUserInfoLoad={onUserInfoLoad} />
    </div>
  );
};

const useLoginHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setUserState = useMainStore((state) => state.setUser);

  const [loginFailureMessage, setLoginFailureMessage] = useState<string | null>(
    null,
  );

  const { getDataKeys, mutateCache } = useLoadDataConfig();

  const onUserInfoLoad = useCallback(
    (otplessUser: OtplessUser) => {
      if (!otplessUser.identities[0]?.verified) {
        setLoginFailureMessage(
          "We could not verify your Phone number or OTP, please try again later!",
        );
        return;
      }

      const body = {
        phone_number: "+" + otplessUser.identities[0]?.identityValue,
        otp: otplessUser.idToken,
        uid: otplessUser.userId,
      };

      post<UserResponse>("/login", body)
        .then((response) => {
          if (!response) {
            throw new Error("No User Data found!");
          }
          setUserState({
            userId: response.id.toString(),
            phone: response.phone_number,
            handle: response.username,
            isUserLoggedIn: true,
            userCoins: [
              {
                type: CoinType.Earned,
                coins: response.earned_coins,
                isRedeemable: true,
              },
              {
                type: CoinType.Bonus,
                coins: response.bonus_coins,
                isRedeemable: false,
              },
            ],
            maxOpinionCoins: response.max_opinion_coins,
            isNewUser: !!response.new_user,
          });

          mutateCache(getDataKeys(), { revalidate: true });

          const referrerPath = searchParams?.get(REFERRER_PARAM) ?? HOME_PATH;
          router.push(referrerPath);
        })
        .catch((error) => {
          console.log("Login Error: ", error);
          setLoginFailureMessage("Login failed, please try again later!");
        });
    },
    [router, getDataKeys, mutateCache, setUserState],
  );

  return { loginFailureMessage, setLoginFailureMessage, onUserInfoLoad };
};

const LoginPage = () => (
  <Suspense>
    <LoginPageBase />
  </Suspense>
);

export default LoginPage;
