from app import db
from sqlalchemy import inspect, UniqueConstraint, TIMESTAMP
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timedelta
import os, base64
##############
# This file defines each table in the database. For example, the Appliance table
# has several columns -- the name of the appliance, its ID, the status of the appliance,
# and its alert details.
##############



class BatteryLogger(db.Model):
    __tablename__ = "battery_logger"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    #device_id = db.Column(db.Integer, db.ForeignKey('device.id', ondelete='CASCADE'))
    #parent_device = db.relationship('device', backref=db.backref)
    timestamp_time = db.Column(db.TIMESTAMP, nullable = False)
    device_battery = db.Column(db.Float, nullable=False) # May change from float later
    device_id = db.Column(db.Integer, db.ForeignKey('device.id', ondelete='CASCADE'), nullable=False)

    device = relationship("Device", backref = "battery_logger")

    def to_dict(self):
        return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}
            
    def update(self, myDict):
        for key, value in myDict.items():
            setattr(self, key, value)

    def __repr__(self):
        return '<Device {}, battery Logs>'.format(self.id)

class Device(db.Model):
    __name__ = "device"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    appliance_name = db.Column(db.String(64), nullable=False)
    device_state = db.Column(db.Integer, default=False, nullable=False)
    device_battery = db.Column(db.Float, nullable=True) # May change from float later
    timestamp = db.Column(db.TIMESTAMP, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    users = db.relationship('User', backref=db.backref('device', passive_deletes=True))

   # logs = relationship ("BatteryLogger", back_populates="addresses")

    #To dictionary functions are used to format the data to make it easier to JSONIFY    
    def to_dict(self):
        return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}
            
    def update(self, myDict):
        for key, value in myDict.items():
            setattr(self, key, value)

    def __repr__(self):
        return '<Device {}>'.format(self.id)

class User(UserMixin, db.Model):
    __name__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    password = db.Column(db.String(512), nullable=False)
    email = db.Column(db.String(64), nullable=False, unique=True)
    devices = db.relationship('Device', backref='owner', lazy='dynamic')


    def to_dict(self):
        return {c.key: getattr(self, c.key)
            for c in inspect(self).mapper.column_attrs}

    def update(self, myDict):
        for key, value in myDict.items():
            setattr(self, key, value)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    # This is how the object looks when printed out.
    def __repr__(self):
        return '<User {}>'.format(self.email)
