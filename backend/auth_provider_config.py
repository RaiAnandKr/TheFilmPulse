from abc import ABC, abstractmethod
import requests
import os
import OTPLessAuthSDK


class AuthProvider(ABC):
    # TODO: Define return types (include error message)
    @abstractmethod
    def verify_token(self, **kwargs):
        pass


class OTPLess(AuthProvider):
    def __init__(self):
        # self.api_url = "https://auth.otpless.app/auth/otp/v1/verify"
        # self.app_id = kwargs.get('app_id')
        self.client_id = os.environ.get('OTPLESS_CLIENT_ID')
        self.client_secret = os.environ.get('OTPLESS_CLIENT_SECRET')

    def verify_token(self, **kwargs):
        order_id = kwargs.get('uid')
        otp = kwargs.get('otp')
        phone_number = kwargs.get('phone_number')
        print(order_id)
        # TODO: exception handling
        # This not a typo lol
        result = OTPLessAuthSDK.OTP.veriy_otp(
            orderId=order_id,
            otp=otp,
            phoneNumber=phone_number,
            email=None,
            client_id=self.client_id,
            client_secret=self.client_secret)
        # sample result={'isOTPVerified': False, 'reason': 'Incorrect OTP!'}
        return result['isOTPVerified']


class AuthProviderFactory:
    @staticmethod
    def get_auth_provider(provider_name):
        if provider_name == 'otpless':
            return OTPLess()
        else:
            raise ValueError(f"Unsupported provider: {provider_name}")
