import base64
import json
import os
import traceback
from typing import Type
from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Flask, jsonify, request, g
from flask.views import View
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, set_access_cookies, create_access_token, \
    get_jwt
from flask_migrate import Migrate

from views import PredictionView, FilmView, OpinionView, UserPredictionView, UserOpinionView, VoucherView, \
    VoucherCodeView, UserView, calc_max_opinion_coins
from extensions import db
from models import User, Film, Opinion
from view_decorators import load_user_strict
from serializers import UserSerializer

from auth_provider_config import AuthProviderFactory

app = Flask(__name__)
# backend_host = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:8081')

env = os.environ.get('APP_ENV', 'prod')
if env == 'prod':
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')

jwt = JWTManager(app)
CORS(app, supports_credentials=True)

# TODO: db hackx, cleanup later
db.init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()

auth_provider = AuthProviderFactory.get_auth_provider('otpless')


# Using an `after_request` callback, we refresh any token that is expiring in a week
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(days=7))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


# TODO: Find a way to refactor routes - Blueprints?
@app.route("/")
def hello_world():
    """A simple route returning a message"""
    return jsonify({"message": "Hello from your Flask Backend!"})

def base64url_decode(input):
    input += '=' * (4 - len(input) % 4)
    return base64.urlsafe_b64decode(input)

def decode_jwt_without_verification(token):
    _, payload_b64, _ = token.split('.')
    payload = json.loads(base64url_decode(payload_b64).decode('utf-8'))
    print("Login user info: ", payload)

# TODO: errors & exception handling
@app.route("/login", methods=['POST'])
def login():
    data = request.json
    phone_number = data.get('phone_number', None)
    kwargs = {
        'phone_number': phone_number,
        'uid': data.get('uid'),
        'otp': data.get('otp')
    }
    try:
        decode_jwt_without_verification(data.get('otp'))
    except Exception as e:
        print(f'Error decoding login user info JWT: {e}')

    newUser = False
    try:
        # Throws exception if unsuccessful
        user_name = auth_provider.verify_token(**kwargs)
        user = User.query.filter_by(username=user_name).one_or_none()
        if not user:
            # TODO: hackx for now. Make the user signup instead of doing this
            session = db.session()
            user = User(username=user_name)
            session.add(user)
            session.commit()
            newUser = True

        user_serializer = UserSerializer()
        serialized_user = user_serializer.serialize(user)
        serialized_user["max_opinion_coins"] = calc_max_opinion_coins(
            user.bonus_coins + user.earned_coins
        )
        if newUser:
            print("Login user is a new user")
            serialized_user["new_user"] = 1

        resp = jsonify(serialized_user)

        access_token = create_access_token(identity=user.id)
        set_access_cookies(resp, access_token)
        return resp, 200
    except Exception as e:
        # TODO: Gotta get that logging thing soon
        traceback.print_exc()
        return jsonify({"message": "Something went wrong"}), 500
        pass
    pass

def add_api(path: str, view: Type[View]):
    app.add_url_rule(path, view_func=view.as_view(path))


add_api('/predictions', PredictionView)
add_api('/films', FilmView)
add_api('/opinions', OpinionView)
add_api('/user_predictions', UserPredictionView)
add_api('/user_opinions', UserOpinionView)
add_api('/vouchers', VoucherView)
add_api('/voucher_codes', VoucherCodeView)
add_api('/user', UserView)

if __name__ == "__main__":
    app.run(debug=True)
