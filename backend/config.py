import os
import sqlalchemy as sa

class DataBaseConfig(object):
    DB_DIALECT = 'postgresql'
    DB_HOST = os.environ.get('DB_HOST')
    DB_USERNAME = os.environ.get('DB_USERNAME')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_NAME = os.environ.get('DB_NAME')
    # SQLALCHEMY_DATABASE_URI = f'{DB_DIALECT}://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
    SQLALCHEMY_DATABASE_URI = sa.URL.create(
        DB_DIALECT,
        username=DB_USERNAME,
        password=DB_PASSWORD,
        host=DB_HOST,
        database=DB_NAME,
    )


class JWTConfig(object):
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET')
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    # Think this is default but anyway
    JWT_COOKIE_SECURE = True


class Config(DataBaseConfig, JWTConfig):
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False
    pass


class ProductionConfig(Config):
    pass
