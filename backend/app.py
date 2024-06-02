import os
import uuid
from typing import Type
from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Flask, jsonify, request
from flask.views import View
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, set_access_cookies, create_access_token, \
    get_jwt
from flask_migrate import Migrate

from views import PredictionView, FilmView, OpinionView, UserPredictionView, UserOpinionView
from extensions import db
from models import User, Film, Opinion

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


# # Callback used by the JWT lib to load user
# @jwt.user_lookup_loader
# def user_lookup_callback(_jwt_header, jwt_data):
#     identity = jwt_data["sub"]
#     return User.query.filter_by(id=identity).one_or_none()
#
#
# @jwt.user_identity_loader
# def user_identity_lookup(user):
#     return user.id


# TODO: Find a way to refactor routes - Blueprints?
@app.route("/")
def hello_world():
    """A simple route returning a message"""
    return jsonify({"message": "Hello from your Flask Backend!"})


# TODO: errors & exception handling
@app.route("/login", methods=['POST'])
def login():
    data = request.json
    phone_number = data.get('phone_number')
    kwargs = {
        'phone_number': phone_number,
        'uid': data.get('uid'),
        'otp': data.get('otp')
    }

    try:
        # verified = auth_provider.verify_token(**kwargs)
        # if not verified:
        #     return jsonify({"message": "Error verifying token"}), 403
        user = User.query.filter_by(phone_number=phone_number).one_or_none()
        if not user:
            # TODO: hackx for now. Make the user signup instead of doing this
            session = db.session()
            user = User(phone_number=phone_number, username=str(uuid.uuid4(4)))
            session.add(user)
            session.commit()
        resp = jsonify(user)
        access_token = create_access_token(identity=user.id)
        set_access_cookies(resp, access_token)
        return resp, 200
    except Exception as e:
        # TODO: Gotta get that logging thing soon
        return jsonify({"message": "Something went wrong"}), 500
        pass
    pass


# TODO: Change these to class based views
@app.route("/profile", methods=['GET'])
@jwt_required()
def get_profile():
    phone = get_jwt_identity()
    user = User.query.filter_by(phone_number=phone).first()
    return jsonify(user), 200


@app.route("/profile", methods=['PUT'])
@jwt_required()
def update_profile():
    phone = get_jwt_identity()
    session = db.session()
    user = session.query(User).filter_by(phone_number=phone).first()
    user.full_name = request.json.get('full_name')
    user.email = request.json.get('email')
    session.commit()
    return jsonify(user), 200


@app.route("/coins", methods=['GET'])
def get_coins():
    user_id = request.args.get('id', type=int)
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'bonus_coins': user.bonus_coins,
        'earned_coins': user.earned_coins,
        'max_opinion_coins': max(40, 0.4 * (user.bonus_coins + user.earned_coins))
    })


def add_api(path: str, view: Type[View]):
    app.add_url_rule(path, view_func=view.as_view(path))


add_api('/predictions', PredictionView)
add_api('/films', FilmView)
add_api('/opinions', OpinionView)
add_api('/user_predictions', UserPredictionView)
add_api('/user_opinions', UserOpinionView)

if __name__ == "__main__":
    app.run(debug=True)
