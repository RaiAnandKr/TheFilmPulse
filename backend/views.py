import os
from flask import request, jsonify, has_request_context, g
from flask.views import MethodView
from dataclasses import is_dataclass, fields
import dataclasses
from datetime import datetime
import pytz
from sqlalchemy import or_
from cryptography.fernet import Fernet

from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from sqlalchemy.sql import sqltypes

from view_decorators import load_user_strict, load_user_optional
from models import User, Prediction, Film, Opinion, UserPrediction, UserOpinion, Voucher, VoucherCode
from extensions import db
from serializers import BaseSerializer, UserSerializer
from sqlalchemy.exc import IntegrityError

# Setting the server's timezone to Indian Standard Time
SERVER_TIMEZONE = 'Asia/Kolkata'


class BaseAPIView(MethodView):
    model = None
    columns = []
    sort_by = 'id'
    sort_order = 'desc'
    limit = 100
    offset = 0
    methods = ['GET', 'POST', 'PUT', 'DELETE']
    serializer_class = BaseSerializer

    decorators = [load_user_optional]

    def __init__(self):
        super().__init__()

        if self.model is None:
            raise ValueError(f"{self.__class__.__name__} must be assigned to a model")

        if self.columns is None:
            if is_dataclass(self.model):
                self.columns = dataclasses.fields(self.model.__annotations__)
            else:
                self.columns = self.model.__table__.columns

        self.serializer = self.serializer_class(self.columns)

    @staticmethod
    def method_not_allowed():
        return jsonify({'message': 'Method Not Allowed'}), 405

    def pagination_get(self, request, query):
        limit = request.args.get('limit', self.limit, type=int)
        offset = request.args.get('offset', self.offset, type=int)
        return query.limit(limit).offset(offset)

    def sorting_get(self, request, query):
        sort_by = request.args.get('sort_by', self.sort_by)
        sort_order = request.args.get('sort_order', self.sort_order)
        if sort_order == 'desc':
            return query.order_by(db.desc(getattr(self.model, sort_by)))
        else:
            return query.order_by(getattr(self.model, sort_by))

    def filter_on_table_columns_get(self, request, query):
        # TODO: restrict to self.columns?
        for column in self.model.__table__.columns:
            # gets value as string
            value = request.args.get(column.name)
            if value:
                # Convert str to int
                if type(column.type) is sqltypes.Integer:
                    value = int(value)
                query = query.filter(getattr(self.model, column.name) == value)

        return query

    def get(self):
        if 'GET' not in self.methods:
            return self.method_not_allowed()

        query = self.model.query

        query = self.filter_on_table_columns_get(request, query)

        # Handle filtering by film title
        film_title = request.args.get('film_title')
        if film_title and self.model in [Prediction, Opinion]:
            query = query.join(Film).filter(Film.title.contains(film_title))

        include_closed = request.args.get('include_closed', '').lower() == 'true'
        # Only return those predictions / opinions which either don't have an end_date
        # or their end_date hasn't passed yet if the client isn't explicitly asking for
        # closed games as well.
        if self.model in [Prediction, Opinion] and not include_closed:
            # Get the current date in the server's timezone
            tz = pytz.timezone(SERVER_TIMEZONE)
            current_date = datetime.now(tz).date()
            query = query.filter(or_(self.model.end_date >= current_date, self.model.end_date == None))

        query = self.sorting_get(request, query)
        query = self.pagination_get(request, query)

        items = query.all()

        if self.model not in [Prediction, Opinion]:
            return jsonify([self.serializer.serialize(item) for item in items])

        # For Predictions and Opinions, we also need to return the votes of the logged in user (if there is
        # one) for each of the predictions/opinions.
        results = []
        user = g.user

        # If there is no logged in user, just return an empty dictionary for user_vote.
        if not user:
            for item in items:
                serialized_item = self.serializer.serialize(item)
                serialized_item['user_vote'] = {}
                results.append(serialized_item)
            return jsonify(results)

        user_id = user.id
        # For each prediction (or opinion), find if the logged in user has a vote and add it in the result.
        for item in items:
            serialized_item = self.serializer.serialize(item)
            if self.model == Opinion:
                user_vote = UserOpinion.query.filter_by(user_id=user_id, opinion_id=item.id).first()
            else:
                user_vote = UserPrediction.query.filter_by(user_id=user_id, prediction_id=item.id).first()

            serialized_item['user_vote'] = (
                self.serializer.serialize(user_vote)
                if user_vote else {}
            )
            results.append(serialized_item)

        return jsonify(results)

    def post(self):
        if 'POST' not in self.methods:
            return self.method_not_allowed()

        data = request.get_json()
        new_item = self.model(**data)
        db.session.add(new_item)
        db.session.commit()
        return jsonify(self.serializer.serialize(new_item)), 201

    def put(self, item_id):
        if 'PUT' not in self.methods:
            return self.method_not_allowed()

        item = self.model.query.get_or_404(item_id)
        data = request.get_json()
        for key, value in data.items():
            setattr(item, key, value)
        db.session.commit()
        return jsonify(self.serializer.serialize(item))

    def delete(self, item_id):
        if 'DELETE' not in self.methods:
            return self.method_not_allowed()

        item = self.model.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        return '', 204


class PredictionView(BaseAPIView):
    model = Prediction
    sort_by = 'user_count'


class UserView(BaseAPIView):
    model = User
    serializer_class = UserSerializer
    methods = ['GET', 'PUT']

    decorators = [load_user_strict]

    def get(self):
        return self.serializer.serialize(g.user)

    def put(self, *args, **kwargs):
        # TODO: proper serializer 🥲
        user = g.user
        user.username = request.json.get('username')
        user.email = request.json.get('email')
        user.state = request.json.get('state')
        db.session.commit()
        return self.serializer.serialize(user)


class FilmView(BaseAPIView):
    model = Film
    sort_by = 'popularity_score'

    def get(self):
        if 'GET' not in self.methods:
            return self.method_not_allowed()

        query = self.model.query

        query = self.filter_on_table_columns_get(request, query)

        # A film can be queried using 'title' query parameter as well (since that maps
        # to a column in the film table) but adding support for 'film_title' query
        # param too just to ensure consistency with other endpoints which support
        # 'film_title' only.
        film_title = request.args.get('film_title')
        if film_title:
            query = query.filter(Film.title.contains(film_title))

        # Same consistency for 'film_id'
        film_id = request.args.get('film_id', type=int)
        if film_id:
            query = query.filter(Film.id == film_id)

        query = self.sorting_get(request, query)
        query = self.pagination_get(request, query)

        items = query.all()

        user = g.user
        results = []
        # Go over each film, and fetch the most popular prediction (decided by user count
        # for each prediction) and return that prediction along with the film data
        for item in items:
            serialized_item = self.serializer.serialize(item)

            top_prediction = Prediction.query.filter_by(
                film_id=item.id).order_by(Prediction.user_count.desc()).first()
            if not top_prediction:
                results.append(serialized_item)
                continue

            # For each prediction, get the user_vote if there is a logged in user and if it has already voted in
            # that prediction.
            serialized_top_prediction = self.serializer.serialize(top_prediction)
            serialized_top_prediction['user_vote'] = {}
            if user:
                user_vote = UserPrediction.query.filter_by(user_id=user.id, prediction_id=top_prediction.id).first()
                serialized_top_prediction['user_vote'] = self.serializer.serialize(user_vote) if user_vote else {}
            serialized_item['top_prediction'] = serialized_top_prediction
            results.append(serialized_item)

        return jsonify(results)


class OpinionView(BaseAPIView):
    model = Opinion
    sort_by = 'user_count'


class VoucherView(BaseAPIView):
    model = Voucher
    sort_by = 'coins'
    sort_order = 'asc'

    decorators = []

ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', 'Ggm1M5JGlB6wDmfhVMIzMdmRqctsJKXWzOemNDixIBI=')
cipher = Fernet(ENCRYPTION_KEY.encode())

def encrypt(code):
    encrypted_code = cipher.encrypt(code.encode())
    return encrypted_code.decode()

class VoucherCodeView(BaseAPIView):
    model = VoucherCode
    sort_by = 'expiry_date'
    sort_order = 'asc'

    methods = ['GET', 'POST']

    decorators = [load_user_strict]

    def get(self):
        if 'GET' not in self.methods:
            return self.method_not_allowed()

        user = g.user
        if not user:
            return jsonify({'error': 'User not found'}), 404

        claimed = request.args.get('claimed')
        voucher_id = request.args.get('voucher_id')
        if voucher_id:
            voucher_id = int(voucher_id)

        query = self.model.query

        # Return all voucher codes claimed by the user
        if claimed == 'true':
            voucher_codes = query.filter_by(claimed_user_id=user.id).all()

            results = []
            # Encrypt each of the voucher code and also return the voucher info along with
            # the voucher codes.
            for vc in voucher_codes:
                vc.code = encrypt(vc.code)
                serialized_vc = self.serializer.serialize(vc)
                serialized_vc['voucher'] = self.serializer.serialize(vc.voucher)

                results.append(serialized_vc)

            return jsonify(results)

        if not voucher_id:
            return jsonify({'error': 'One of claimed or voucher_id args should be set'}), 400

        # Assume that a new voucher code is being redeemed by a user.
        # Return one unclaimed voucher code for the given voucher_id with the earliest expiry date
        query = query.filter_by(voucher_id=voucher_id, claimed_user_id=None)
        query = query.order_by(VoucherCode.expiry_date.asc()).limit(1)

        voucher_codes = query.all()

        if not voucher_codes:
            return jsonify({'error': 'No unclaimed voucher code available'}), 400

        # There will be only 1 voucher code
        voucher_code = voucher_codes[0]

        if user.earned_coins < voucher_code.voucher.coins:
            return jsonify({'error': 'User has insufficient coins to claim this voucher'}), 400

        user.earned_coins -= voucher_code.voucher.coins
        voucher_code.claimed_user_id = user.id

        db.session.commit()

        voucher_code.code = encrypt(voucher_code.code)
        return jsonify([self.serializer.serialize(voucher_code)])

# This class is to deal with user's participations in different contests we have on the
# platform.
class BaseUserAPIView(MethodView):
    model = None
    columns = []
    sort_by = 'id'
    sort_order = 'asc'
    methods = ['GET', 'POST']
    serializer_class = BaseSerializer

    decorators = [load_user_strict]

    def __init__(self):
        if self.model is None:
            raise ValueError(f"{self.__class__.__name__} must be assigned to a model")

        if self.columns is None:
            if is_dataclass(self.model):
                self.columns = dataclasses.fields(self.model.__annotations__)
            else:
                self.columns = self.model.__table__.columns

        self.serializer = self.serializer_class(self.columns)
        pass

    @staticmethod
    def method_not_allowed():
        return jsonify({'message': 'Method Not Allowed'}), 405

    def get(self):
        """ This get method here doesn't return a json response. It simply returns the items
        queried from DB and a get would have to be implemented further in the derived class
        to act upon the items.
        """
        if 'GET' not in self.methods:
            return self.method_not_allowed()

        query = self.model.query

        user = g.user
        # If an user is set, fetch predictions/opinions only for that user.
        if user:
            query = query.filter_by(user_id=user.id)

        # TODO: restrict to self.columns?
        for column in self.model.__table__.columns:
            # gets value as string
            value = request.args.get(column.name)
            if value:
                # Convert str to int
                if type(column.type) is sqltypes.Integer:
                    value = int(value)
                query = query.filter(getattr(self.model, column.name) == value)

        # TODO: convert sort and pagination to mixins
        sort_by = request.args.get('sort_by', self.sort_by)
        sort_order = request.args.get('sort_order', self.sort_order)
        if sort_order == 'desc':
            query = query.order_by(db.desc(getattr(self.model, sort_by)))
        else:
            query = query.order_by(getattr(self.model, sort_by))

        items = query.all()
        return items

    def post(self):
        if 'POST' not in self.methods:
            return self.method_not_allowed()

        data = request.get_json()
        new_item = self.model(**data)
        db.session.add(new_item)
        db.session.commit()
        return jsonify(self.serializer.serialize(new_item)), 201


class UserPredictionView(BaseUserAPIView):
    model = UserPrediction

    def get(self):
        items = super().get()
        results=[]
        for item in items:
            serialized_item = self.serializer.serialize(item)
            serialized_item['prediction'] = self.serializer.serialize(item.prediction)
            results.append(serialized_item)

        return jsonify(results)

    def post(self):
        if 'POST' not in self.methods:
            return self.method_not_allowed()

        user = g.user
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user_id = user.id

        data = request.get_json()
        # The user_id was retrieved from the JWT in the cookies and set into data so that we could
        # insert the entire data object at once later.
        data['user_id'] = user_id
        prediction_id = data.get('prediction_id')
        answer = data.get('answer')

        prediction = Prediction.query.filter_by(id=prediction_id).first()
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404

        # Check if the prediction already exists for the user.
        existing_prediction = UserPrediction.query.filter_by(user_id=user_id,
                                                             prediction_id=prediction_id).first()
        if existing_prediction:
            return jsonify({'error': 'Prediction already exists for this user'}), 400

        if answer < prediction.min_value or answer > prediction.max_value:
            return jsonify({'error': 'Prediction value not in range'}), 400

        prediction.mean_value = ((prediction.mean_value * prediction.user_count) + answer) / (prediction.user_count + 1)
        # Increase user_count for this prediction.
        prediction.user_count += 1

        try:
            new_item = self.model(**data)
            db.session.add(new_item)
            db.session.commit()

            return jsonify(self.serializer.serialize(new_item)), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': 'Integrity error, possibly due to foreign key constraints'}), 400


class UserOpinionView(BaseUserAPIView):
    model = UserOpinion

    def get(self):
        items = super().get()
        results = []
        for item in items:
            serialized_item = self.serializer.serialize(item)
            serialized_item['opinion'] = self.serializer.serialize(item.opinion)
            results.append(serialized_item)

        return jsonify(results)

    def post(self):
        if 'POST' not in self.methods:
            return self.method_not_allowed()

        user = g.user
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user_id = user.id

        data = request.get_json()
        # The user_id was retrieved from the JWT in the cookies and set into data so that we could
        # insert the entire data object at once later.
        data['user_id'] = user_id

        opinion_id = data.get('opinion_id')
        coins_to_deduct = data.get('coins')
        answer = data.get('answer').lower()

        opinion = Opinion.query.filter_by(id=opinion_id).first()
        if not opinion:
            return jsonify({'error': 'Opinion not found'}), 404

        if coins_to_deduct is None or coins_to_deduct < 0:
            return jsonify({'error': 'Invalid coins value'}), 400

        # Check if the opinion already exists for the user
        existing_opinion = UserOpinion.query.filter_by(user_id=user_id, opinion_id=opinion_id).first()
        if existing_opinion:
            return jsonify({'error': 'Opinion already exists for this user'}), 400

        # Make sure that the user has enough coins.
        if coins_to_deduct > user.bonus_coins + user.earned_coins:
            return jsonify({'error': 'Not enough coins'}), 400

        # If bonus coins exist, reduce them first and then if more coins are needed, reduce
        # the earned coins.
        if user.bonus_coins >= coins_to_deduct:
            user.bonus_coins -= coins_to_deduct
        else:
            remaining_coins = coins_to_deduct - user.bonus_coins
            user.bonus_coins = 0
            user.earned_coins -= remaining_coins

        if answer == 'yes':
            opinion.yes_count += 1
            opinion.yes_coins += coins_to_deduct
        elif answer == 'no':
            opinion.no_count += 1
            opinion.no_coins += coins_to_deduct
        else:
            return jsonify({'error': 'Invalid answer value. Can be either yes or no.'}), 400

        try:
            new_item = self.model(**data)
            db.session.add(new_item)
            db.session.commit()  # Commit both the user and the new opinion

            return jsonify(self.serializer.serialize(new_item)), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': 'Integrity error, possibly due to foreign key constraints'}), 400
