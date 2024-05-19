import Head from "next/head";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginView() {
const router = useRouter();

useEffect(() => {
    window.otpless = (otplessUser) => {
      router.push('/profile')
    };
  }, []);

return (
<>
    <Head>
    // Taken from https://otpless.com/docs/frontend-sdks/web-sdks/react/pre-built-ui
    // TODO: Move the sdk loading to some other place.
    <script
  id="otpless-sdk"
  type="text/javascript"
  src="https://otpless.com/v2/auth.js"
  data-appid="DVBH5ZQ4HREV54PIBTM9"
></script>
    </Head>
    <div>

      <div id="otpless-login-page"></div> {/* OTPLESS Login UI will be inserted here */}
    </div>
    </>
  );
}
