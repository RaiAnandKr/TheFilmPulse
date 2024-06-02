import os
from datetime import timedelta

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
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)


# Maybe use this later
class CORSConfig(object):
    CORS_ORIGINS = ['http://localhost:3000']


class Config(DataBaseConfig, JWTConfig):
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False
    CORS_ORIGINS = ['http://localhost:3000']


class ProductionConfig(Config):
    CORS_ORIGINS = ['https://thefilmpulse.com']
