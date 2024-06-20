/* eslint-disable */
declare const window: any;

import Head from "next/head";
import { useEffect } from 'react';
import { post } from '~/service/apiUtils';
import { useRouter } from 'next/router';

export default function LoginView() {
const router = useRouter();



useEffect(() => {
    window.otpless = (otplessUser:any) => {
      console.log(otplessUser)
      const body = {
        phone_number: '+'+otplessUser['identities'][0]['identityValue'],
        otp: otplessUser['idToken'],
        uid: 'dummy'
      }
      try{
        const resp = post('/login', body)
      } catch (error) {
        console.log('error')
      }
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
/* eslint-disable */
