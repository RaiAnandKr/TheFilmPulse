from dataclasses import dataclass

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app import db


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
    film_id: Mapped[int] = mapped_cloumn(Integer, ForeignKey('film.id'))
    text: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    icon_url: Mapped[str] = mapped_column(String(500))
    user_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    yes_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    no_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    yes_coins: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    no_coins: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    author_id: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
