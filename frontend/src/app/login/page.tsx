"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { OtplessLogin, type OtplessUser } from "~/components/otpless-login";
import { post } from "~/service/apiUtils";

const LoginPage = () => {
  const router = useRouter();

  const onUserInfoLoad = useCallback(
    (otplessUser: OtplessUser) => {
      console.log(otplessUser);
      const body = {
        phone_number: "+" + otplessUser.identities[0]?.identityValue,
        otp: otplessUser.idToken,
        uid: otplessUser.userId,
      };

      try {
        const resp = post("/login", body);
        console.log(resp);
        router.push("/profile");
      } catch (error) {
        console.log("error");
      }
    },
    [router],
  );

  return (
    <div className="bg-success-to-danger flex h-full flex-col justify-center p-6">
      <OtplessLogin onUserInfoLoad={onUserInfoLoad} />
    </div>
  );
};

export default LoginPage;
