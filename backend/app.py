import os
from datetime import timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_migrate import Migrate

from extensions import db
from models import User, Film, Opinion

from auth_provider_config import AuthProviderFactory

app = Flask(__name__)
backend_host = os.environ.get('BACKEND_HOST', 'http://localhost:8081')
CORS(app, origins=[backend_host], supports_credentials=True)

env = os.environ.get('APP_ENV', 'prod')
if env == 'prod':
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')

jwt = JWTManager(app)

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

@app.route("/opinions", methods=['GET'])
def get_opinions():
    """
    1. We will always return opinions sorted by desc order of user_count
    2. /opinions?film=<film_name> is implemented
    3. /opinions?limit=<limit> is implemented
    """

    film_name = request.args.get('film')
    limit = request.args.get('limit', type=int) or None

    session = db.session()
    query = session.query(Opinion).join(Film, Opinion.film_id == Film.id)
    if film_name:
        query = query.filter(Film.title.contains(film_name))

    # Sort by user_count in descending order
    query = query.order_by(Opinion.user_count.desc())

    # Limit results if limit is specified
    if limit:
        query = query.limit(limit)

    # Execute query and fetch results
    opinions = query.all()

    opinions_json = [
        {
            "id": opinion.id,
            "film_name": opinion.film.title,
            "text": opinion.text,
            "icon_url": opinion.icon_url,
            "user_count": opinion.user_count,
            "yes_count": opinion.yes_count,
            "no_count": opinion.no_count,
            "yes_coins": opinion.yes_coins,
            "no_coins": opinion.no_coins,
            "author_id": opinion.author_id
        } for opinion in opinions
    ]

    # Close session
    session.close()

    return jsonify(opinions_json), 200

if __name__ == "__main__":
    app.run(debug=True)
