from app import db
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

##############
# This file defines each table in the database. For example, the Appliance table
# has several columns -- the name of the appliance, its ID, the status of the appliance,
# and its alert details.
##############

class Device(db.Model):
    __name__ = "device"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    appliance_name = db.Column(db.String(64), nullable=False)
    device_state = db.Column(db.Integer, default=False, nullable=False)
    device_battery = db.Column(db.Float, nullable=True) # May change from float later
    timestamp = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Device {}>'.format(self.id)

class User(UserMixin, db.Model):
    __name__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    password = db.Column(db.String(512), nullable=True)
    username = db.Column(db.String(64), nullable=True)
    email = db.Column(db.String(64), nullable=False)
    devices = db.relationship('Device', backref='owner', lazy='dynamic')

    token = db.Column(db.String(32), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)

    def to_dict(self, include_email=False):
        data = {
            'id': self.id,
            'username': self.username
        }
        if include_email:
            data['email'] = self.email
        return data

    def from_dict(self, data, new_user=False):
        for field in ['username', 'email']:
            if field in data:
                setattr(self, field, data[field])
        if new_user and 'password' in data:
            self.set_password(data['password'])

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def get_token(self, expires_in=3600):
        now = datetime.utcnow()
        if self.token and self.token_expiration > now + timedelta(seconds=60):
            return self.token
        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)
        db.session.add(self)
        return self.token

    def revoke_token(self):
        self.token_expiration = datetime.utcnow() - timedelta(seconds=1)

    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None
        return user
    
    # This is how the object looks when printed out.
    def __repr__(self):
        return '<User {}>'.format(self.username)