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
        self.app_id = 'DVBH5ZQ4HREV54PIBTM9'

    def verify_token(self, **kwargs):
        token = kwargs.get('otp')
        phone_number = kwargs.get('phone_number')
        aud = f"{self.client_secret}-{self.app_id}"
        result = OTPLessAuthSDK.UserDetail.decode_id_token(
            id_token=token,
            client_id=self.client_id,
            client_secret=self.client_secret,
            audience=aud)
        return phone_number==result['country_code']+result['national_phone_number']


class AuthProviderFactory:
    @staticmethod
    def get_auth_provider(provider_name):
        if provider_name == 'otpless':
            return OTPLess()
        else:
            raise ValueError(f"Unsupported provider: {provider_name}")
