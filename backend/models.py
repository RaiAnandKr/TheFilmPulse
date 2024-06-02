from dataclasses import dataclass

from sqlalchemy import Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from extensions import db
from datetime import datetime


@dataclass
class User(db.Model):
    id: int
    username: str
    phone_number: str
    email: str
    name: str
    state: str
    bonus_coins: int
    earned_coins: int

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(15), unique=True)
    phone_number: Mapped[str] = mapped_column(String(15), unique=True)
    email: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(20), nullable=True)
    is_banned: Mapped[bool] = mapped_column(default=False)
    state: Mapped[str] = mapped_column(String(50), nullable=True)
    bonus_coins: Mapped[int] = mapped_column(Integer, default=100)
    earned_coins: Mapped[int] = mapped_column(Integer, default=0)

    user_predictions = relationship("UserPrediction", back_populates="user")
    user_opinions = relationship("UserOpinion", back_populates="user")

@dataclass
class Film(db.Model):
    id: int
    title: str
    release_date: datetime
    poster_url: str
    trailer_url: str
    popularity_score: int

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100), unique=True)
    release_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    poster_url: Mapped[str] = mapped_column(String(500), nullable=False)
    trailer_url: Mapped[str] = mapped_column(String(500))
    popularity_score: Mapped[int] = mapped_column(Integer, default=0)

    opinions = relationship("Opinion", back_populates="film")
    predictions = relationship("Prediction", back_populates="film")


@dataclass
class Opinion(db.Model):
    id: int
    film_id: int
    text: str
    icon_url: str
    user_count: int
    yes_count: int
    no_count: int
    yes_coins: int
    no_coins: int
    author_id: int
    end_date: datetime

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    film_id: Mapped[int] = mapped_column(Integer, ForeignKey('film.id'))
    text: Mapped[str] = mapped_column(String(200), unique=True)
    icon_url: Mapped[str] = mapped_column(String(500))
    user_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    yes_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    no_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    yes_coins: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    no_coins: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    author_id: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    film = relationship("Film", back_populates="opinions")
    user_opinions = relationship("UserOpinion", back_populates="opinion")

@dataclass
class UserOpinion(db.Model):
    __tablename__ = 'user_opinion'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    opinion_id: Mapped[int] = mapped_column(Integer, ForeignKey('opinion.id'))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'))
    coins: Mapped[int] = mapped_column(Integer, nullable=False)
    answer: Mapped[str] = mapped_column(String(5), nullable=False)

    opinion = relationship("Opinion", back_populates="user_opinions")
    user = relationship("User", back_populates="user_opinions")

@dataclass
class Prediction(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    film_id: Mapped[int] = mapped_column(Integer, ForeignKey('film.id'))
    text: Mapped[str] = mapped_column(String(200))
    icon_url: Mapped[str] = mapped_column(String(500))
    user_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    min_value: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    max_value: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    mean_value: Mapped[float] = mapped_column(Float, nullable=True, default=0.0)
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    film = relationship("Film", back_populates="predictions")
    user_predictions = relationship("UserPrediction", back_populates="prediction")

@dataclass
class UserPrediction(db.Model):
    __tablename__ = 'user_prediction'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    prediction_id: Mapped[int] = mapped_column(Integer, ForeignKey('prediction.id'))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'))
    answer: Mapped[float] = mapped_column(Float, nullable=False)

    prediction = relationship("Prediction", back_populates="user_predictions")
    user = relationship("User", back_populates="user_predictions")
