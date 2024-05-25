import os
from datetime import timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, set_access_cookies
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from flask_migrate import Migrate

from auth_provider_config import AuthProviderFactory


class ModelDBBase(DeclarativeBase):
    pass


app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
backend_host = os.environ.get('BACKEND_HOST', 'http://localhost:8081')
CORS(app, origins=[backend_host], supports_credentials=True)


env = os.environ.get('APP_ENV', 'prod')
if env == 'prod':
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')


jwt = JWTManager(app)

# TODO: db hackx, cleanup later
db = SQLAlchemy(model_class=ModelDBBase)
migrate = Migrate(app, db)
db.init_app(app)

from models import User

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


if __name__ == "__main__":
    app.run(debug=True)
