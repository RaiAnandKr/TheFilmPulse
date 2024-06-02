from flask import has_request_context, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from models import User


# Put the user object in flask global scope (flask.g),
# It can be retrieved by accessing g.user anywhere in the request scope
def load_user(f):
    def decorator(*args, **kwargs):
        if has_request_context() and verify_jwt_in_request():
            user_id = get_jwt_identity()
            g.user = User.query.filter_by(id=user_id).one_or_none()
        return f(*args, **kwargs)
    return decorator
