import os
from datetime import timedelta
from typing import Type

from flask import Flask, jsonify, request
from flask.views import View
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
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

otpless_config = {
    'client_id': os.environ.get('OTPLESS_CLIENT_ID'),
    'client_secret': os.environ.get('OTPLESS_CLIENT_SECRET'),
}

auth_provider = AuthProviderFactory.get_auth_provider('otpless', **otpless_config)


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
        'order_id': data.get('order_id'),
        'auth_token': data.get('auth_token')
    }

    try:
        user_info = auth_provider.verify_token(**kwargs)
        user = User.query.filter_by(phone_number=phone_number).first()
        if not user:
            # ask the user to signup
            pass
        return jsonify(user), 200
    except:
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
        'max_opinion_coins': max(40, 0.4*(user.bonus_coins + user.earned_coins))
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
