from dataclasses import dataclass, is_dataclass, asdict
from datetime import datetime

# TODO: Improve this or just use marshmallow later
class BaseSerializer:

    def __init__(self, columns=None):
        if columns is None:
            self.columns = []
        self.columns = columns

    def serialize(self, item):
        # TODO: optimize for dataclass?
        if self.columns:
            return {col: self._get_value(getattr(item, col)) for col in self.columns}
        if is_dataclass(item):
            return self._serialize_dataclass(item)
        return self._serialize_model(item)

    # The main aim here is to return the dates in a format which is expected
    # by the frontend.
    def _get_value(self, value):
        if isinstance(value, datetime):
            return value.strftime('%B %d, %Y')
        return value

    def _serialize_dataclass(self, item):
        return {k: self._get_value(v) for k, v in asdict(item).items()}

    def _serialize_model(self, item):
        return {col: self._get_value(getattr(item, col)) for col in item.__table__.columns.keys()}


class UserSerializer(BaseSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__()
        self.columns = ['username', 'email', 'state', 'bonus_coins', 'earned_coins']
