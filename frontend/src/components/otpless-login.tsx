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

const OTLESS_SCRIPT_ID = "otpless-sdk";
const OTPLESS_APP_ID = "DVBH5ZQ4HREV54PIBTM9";
const OTPLESS_PREBUILT_UI_SDK_SRC = "https://otpless.com/v2/auth.js";
const OTPLESS_LOGIN_UI_ID = "otpless-login-page";

const OtplessLoginPrebuilt: React.FC<OtplessLoginProps> = (props) => {
  const { onUserInfoLoad } = props;

  useEffect(() => {
    (window as RedactedWindow).otpless = onUserInfoLoad;

    loadOtplessScript();

    return unloadOtplessScript;
  }, []);

  return (
    /**
     *  OTPLESS Login UI and SDK.
     *  Taken from : https://otpless.com/docs/frontend-sdks/web-sdks/react/pre-built-ui.
     */
    <>
      <div id={OTPLESS_LOGIN_UI_ID}></div>
    </>
  );
};

const loadOtplessScript = () => {
  if (document.getElementById(OTLESS_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("id", OTLESS_SCRIPT_ID);
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", OTPLESS_PREBUILT_UI_SDK_SRC);
  script.setAttribute("data-appid", OTPLESS_APP_ID);
  script.onload = updateLoginUIStyles;

  document.body.appendChild(script);
};

const unloadOtplessScript = () => {
  const otplessScriptNode = document.getElementById(OTLESS_SCRIPT_ID);
  if (otplessScriptNode) {
    document.body.removeChild(otplessScriptNode);
  }
};

const updateLoginUIStyles = () => {
  const loginUIWrapperElement = document.getElementById(OTPLESS_LOGIN_UI_ID);
  if (!loginUIWrapperElement) {
    return;
  }

  loginUIWrapperElement.setAttribute(
    "style",
    loginUIWrapperElement.getAttribute("style") + "; height: 75%;",
  );
};

export { OtplessLoginPrebuilt as OtplessLogin, type OtplessUser };
