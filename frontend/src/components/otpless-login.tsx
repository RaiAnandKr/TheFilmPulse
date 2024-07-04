import Script from "next/script";
import { useEffect } from "react";

type RedactedWindow = Window &
  typeof globalThis & { otpless: (otplessUser: OtplessUser) => void };

interface OtplessUser {
  token: string;
  userId: string;
  timestamp: string;
  identities: {
    identityType: "MOBILE";
    identityValue: string;
    channel: "OTP";
    methods: ["SMS"];
    verified: true;
    verifiedAt: string;
  }[];
  idToken: string;
}

interface OtplessLoginProps {
  onUserInfoLoad: (userInfo: OtplessUser) => void;
}

const OTPLESS_APP_ID = "DVBH5ZQ4HREV54PIBTM9";
const OTPLESS_SDK_SRC = "https://otpless.com/v2/auth.js";
const OTPLESS_LOGIN_UI_ID = "otpless-login-page";

const OtplessLogin: React.FC<OtplessLoginProps> = (props) => {
  const { onUserInfoLoad } = props;

  useEffect(() => {
    (window as RedactedWindow).otpless = onUserInfoLoad;
  }, []);

  return (
    /**
     *  OTPLESS Login UI and SDK.
     *  Taken from : https://otpless.com/docs/frontend-sdks/web-sdks/react/pre-built-ui.
     */
    <>
      <div id={OTPLESS_LOGIN_UI_ID}></div>
      <Script
        id="otpless-sdk"
        type="text/javascript"
        src={OTPLESS_SDK_SRC}
        data-appid={OTPLESS_APP_ID}
        onLoad={updateLoginUIStyles}
      />
    </>
  );
};

const updateLoginUIStyles = () => {
  const loginUI = document.getElementById(OTPLESS_LOGIN_UI_ID);
  if (loginUI) {
    loginUI.setAttribute(
      "style",
      loginUI.getAttribute("style") + "; height: 75%;",
    );
  }
};

export { OtplessLogin, type OtplessUser };
