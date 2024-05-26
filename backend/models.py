from dataclasses import dataclass

from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app import db
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
