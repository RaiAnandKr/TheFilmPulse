import { useEffect } from "react";
import { OtplessSDK } from "~/constants/sdks";

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
      <div id={OtplessSDK.loginUIId}></div>
    </>
  );
};

const loadOtplessScript = () => {
  if (document.getElementById(OtplessSDK.scriptId)) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("id", OtplessSDK.scriptId);
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", OtplessSDK.prebuiltUISrc);
  script.setAttribute("data-appid", OtplessSDK.appId);
  script.onload = updateLoginUIStyles;

  document.body.appendChild(script);
};

const unloadOtplessScript = () => {
  const otplessScriptNode = document.getElementById(OtplessSDK.scriptId);
  if (otplessScriptNode) {
    document.body.removeChild(otplessScriptNode);
  }
};

const updateLoginUIStyles = () => {
  const loginUIWrapperElement = document.getElementById(OtplessSDK.loginUIId);
  if (!loginUIWrapperElement) {
    return;
  }

  loginUIWrapperElement.setAttribute(
    "style",
    loginUIWrapperElement.getAttribute("style") + "; height: 50%;",
  );
};

export { OtplessLoginPrebuilt as OtplessLogin, type OtplessUser };
