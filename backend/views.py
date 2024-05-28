from flask import request, jsonify
from flask.views import MethodView
from dataclasses import is_dataclass, fields
import dataclasses

from models import Prediction, Film, Opinion
from extensions import db
from serializers import BaseSerializer


class BaseAPIView(MethodView):
    model = None
    columns = []
    sort_by = 'id'
    sort_order = 'desc'
    methods = ['GET', 'POST', 'PUT', 'DELETE']
    serializer_class = BaseSerializer
    limit = 100
    offset = 0

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

    def pagination_get( self, request, query ):
        limit = request.args.get('limit', self.limit, type=int)
        offset = request.args.get('offset', self.offset, type=int)
        return query.limit(limit).offset(offset)

    def sorting_get( self, request, query ):
        sort_by = request.args.get('sort_by', self.sort_by)
        sort_order = request.args.get('sort_order', self.sort_order)
        if sort_order == 'desc':
            return query.order_by(db.desc(getattr(self.model, sort_by)))
        else:
            return query.order_by(getattr(self.model, sort_by))

    def get(self):
        if 'GET' not in self.methods:
            return self.method_not_allowed()

        query = self.model.query

        # TODO: restrict to self.columns?
        for column in self.model.__table__.columns:
            value = request.args.get(column.name)
            if value:
                query = query.filter(getattr(self.model, column.name) == value)

        # Handle filtering by film title
        film_title = request.args.get('film_title')
        if film_title and self.model in [Prediction, Opinion]:
            query = query.join(Film).filter(Film.title.contains(film_title))

        query = self.sorting_get( request, query )
        query = self.pagination_get( request, query )

        items = query.all()
        return jsonify([self.serializer.serialize(item) for item in items])

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
    methods = ['GET']
    sort_by = 'user_count'

class FilmView(BaseAPIView):
    model = Film
    methods = ['GET']
    sort_by = 'popularity_score'

class OpinionView(BaseAPIView):
    model = Opinion
    methods = ['GET']
    sort_by = 'user_count'
