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
    sort_order = 'asc'
    methods = ['GET', 'POST', 'PUT', 'DELETE']
    serializer_class = BaseSerializer

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
        if 'GET' not in self.methods:
            return self.method_not_allowed()

        query = self.model.query

        # TODO: restrict to self.columns?
        for column in self.model.__table__.columns:
            value = request.args.get(column.name)
            if value:
                query = query.filter(getattr(self.model, column.name) == value)

        # TODO: convert sort and pagination to mixins
        sort_by = request.args.get('sort_by', self.sort_by)
        sort_order = request.args.get('sort_order', self.sort_order)
        if sort_order == 'desc':
            query = query.order_by(db.desc(getattr(self.model, sort_by)))
        else:
            query = query.order_by(getattr(self.model, sort_by))

        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('page_size', 10, type=int)
        query = query.offset((page - 1) * per_page).limit(per_page)

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


class FilmView(BaseAPIView):
    model = Film
    methods = ['GET']

class OpinionView(BaseAPIView):
    model = Opinion
    methods = ['GET']
