from flask import has_request_context, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError

from models import User


# Put the user object in flask global scope (flask.g),
# It can be retrieved by accessing g.user anywhere in the request scope
def load_user_strict(f):
    def decorator(*args, **kwargs):
        if has_request_context():
            verify_jwt_in_request()  # This will attempt to verify the JWT
            user_id = get_jwt_identity()
            g.user = User.query.filter_by(id=user_id).one_or_none()
        return f(*args, **kwargs)
    return decorator

def load_user_optional(f):
    def decorator(*args, **kwargs):
        if has_request_context():
            try:
                verify_jwt_in_request()  # This will attempt to verify the JWT
                user_id = get_jwt_identity()
                g.user = User.query.filter_by(id=user_id).one_or_none()
            except (NoAuthorizationError, InvalidHeaderError):
                g.user = None  # If the JWT is missing or invalid, g.user will be None
        return f(*args, **kwargs)
    return decorator
