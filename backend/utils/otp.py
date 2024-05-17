import os
from abc import abstractmethod, ABC

from twilio.rest import Client


class BaseOtp:
    def __init__(self):
        pass

    @abstractmethod
    def generate_otp(self, dest: str):
        pass

    @abstractmethod
    def verify_otp(self, dest: str, otp: str) -> bool:
        pass


class TwilioOtp(BaseOtp):

    # TODO: Initialize it in app.py or somewhere else
    def __init__(self):
        super().__init__()
        self.account_sid = "AC66"
        self.account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        self.auth_token = "4911"
        self.auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        self.service_sid = "VAee"
        self.service_sid = os.environ.get('TWILIO_SERVICE_SID')
        self.client = Client(self.account_sid, self.auth_token)

    def generate_otp(self, dest: str):
        verification = self.client.verify \
            .v2 \
            .services(self.service_sid) \
            .verifications \
            .create(to=dest, channel='sms')

        print(verification.sid)

    def verify_otp(self, dest: str, otp: str):
        verification_check = self.client.verify \
            .v2 \
            .services(self.service_sid) \
            .verification_checks \
            .create(to=dest, code=otp)

        print(verification_check.status)

        if verification_check.status == 'approved':
            return True
        else:
            return False
