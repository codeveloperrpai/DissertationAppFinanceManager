from email.policy import default
from enum import unique
from xmlrpc.client import DateTime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date
from uuid import uuid4
from datetime import datetime

db = SQLAlchemy()


def get_uuid():
    """Generate and return a UUID."""
    return uuid4().hex

# Setting up the DB models for the two tables - User and Attendance

class User(db.Model):
    """User table model."""
    __tablename__ = "user"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

class Account(db.Model):
    """Account table model."""
    __tablename__ = "account"
    name = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=False)
    balance = db.Column(db.Float, nullable=False)

class Transaction(db.Model):
    """Transaction table model."""
    __tablename__ = "transaction"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    type = db.Column(db.String(255))
    account_name = db.Column(db.String(50), db.ForeignKey('account.name'), nullable=False)
    date = db.Column(Date, default=datetime.utcnow, nullable=False)

class Category(db.Model):
    """Category table model."""
    __tablename__ = "category"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=False)
