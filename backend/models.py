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
