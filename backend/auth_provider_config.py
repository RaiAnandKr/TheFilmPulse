from abc import ABC, abstractmethod
import requests


class AuthProvider(ABC):
    @abstractmethod
    def verify_token(self, **kwargs):
        pass


class OTPLess(AuthProvider):
    def __init__(self, **kwargs):
        self.api_url = "https://auth.otpless.app/auth/otp/v1/verify"
        self.app_id = kwargs.get('app_id')
        self.client_id = kwargs.get('client_id')
        self.client_secret = kwargs.get('client_secret')

    def verify_token(self, **kwargs):
        headers = {
            'clientId': self.client_id,
            'clientSecret': self.client_secret
        }
        data = {
            'orderId': kwargs.get('uid'),
            'otp': kwargs.get('otp'),
            'phoneNumber': kwargs.get('phone')
        }
        response = requests.post(self.api_url, json=data, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()


class AuthProviderFactory:
    @staticmethod
    def get_auth_provider(provider_name, **kwargs):
        if provider_name == 'otpless':
            return OTPLess(**kwargs)
        else:
            raise ValueError(f"Unsupported provider: {provider_name}")
