import os
from datetime import timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, set_access_cookies
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from flask_migrate import Migrate

# TODO: Organise configs and secrets

class ModelDBBase(DeclarativeBase):
    pass


app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
backend_host = os.environ.get('BACKEND_HOST', 'http://localhost:8081')
CORS(app, origins=[backend_host], supports_credentials=True)


# JWT stuff
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')
# Only for dev, don't use this in prod
app.config["JWT_COOKIE_SECURE"] = False
jwt = JWTManager(app)

# TODO: db hackx, cleanup later
db = SQLAlchemy(model_class=ModelDBBase)
migrate = Migrate(app, db)
mysql_username = os.environ.get('MYSQL_USERNAME')
mysql_password = os.environ.get('MYSQL_PASSWORD')
mysql_host = os.environ.get('MYSQL_HOST')
mysql_db = os.environ.get('MYSQL_DB')
app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{mysql_username}:{mysql_password}@db/db"
db.init_app(app)

from models import User

with app.app_context():
    db.create_all()


# TODO: Find a way to refactor routes - Blueprints?
@app.route("/")
def hello_world():
    """A simple route returning a message"""
    return jsonify({"message": "Hello from your Flask Backend!"})

# TODO: Change these to class based views
@app.route("/profile", methods=['GET'])
@jwt_required()
def get_profile():
    phone = get_jwt_identity()
    user = User.query.filter_by(phone=phone).first()
    return jsonify(user), 200


@app.route("/profile", methods=['PUT'])
@jwt_required()
def update_profile():
    phone = get_jwt_identity()
    session = db.session()
    user = session.query(User).filter_by(phone=phone).first()
    user.full_name = request.json.get('full_name')
    user.email = request.json.get('email')
    session.commit()
    return jsonify(user), 200


if __name__ == "__main__":
    app.run(debug=True)
