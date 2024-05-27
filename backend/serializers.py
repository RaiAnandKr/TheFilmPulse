from dataclasses import dataclass, is_dataclass, asdict


class BaseSerializer:

    def __init__(self, columns=None):
        if columns is None:
            self.columns = []
        self.columns = columns

    def serialize(self, item):
        # TODO: optimize for dataclass?
        if self.columns:
            return {col: getattr(item, col) for col in self.columns}
        if is_dataclass(item):
            return asdict(item)
        return item.as_dict()
