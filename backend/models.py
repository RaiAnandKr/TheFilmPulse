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

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(15), unique=True)
    phone_number: Mapped[str] = mapped_column(String(15), unique=True)
    email: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(20), nullable=True)
    is_banned: Mapped[bool] = mapped_column(default=False)


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

    film = relationship("Film", back_populates="opinions")


@dataclass
class Prediction(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    film_id: Mapped[int] = mapped_column(Integer, ForeignKey('film.id'))
    text: Mapped[str] = mapped_column(String(200))
    icon_url: Mapped[str] = mapped_column(String(500))
    user_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    min_value: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    max_value: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    film = relationship("Film", back_populates="predictions")
