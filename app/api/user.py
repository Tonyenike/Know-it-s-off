from flask import request, abort, jsonify, Response, redirect
from flask_login import login_required, current_user, login_user
from cerberus import Validator
from app.models import User
from app.api import bp
from app import db

user_schema = {
                    "username": {"type": "string", "maxlength": 64, "nullable": True}, 
                    "email": {"type": "string", "maxlength": 64, "nullable": True}
}

v = Validator(user_schema, allow_unknown=True)

@bp.route('/user/<id>', methods=['GET', 'PATCH', 'DELETE'])
@login_required
def user_get_patch_delete_by_id(id):
    if current_user is None:
        db.session.close()
        abort(404, description="This user does not exist")
    if request.method == 'GET':
        returnValue = jsonify(current_user.to_dict())
        db.session.close()
        return returnValue, 200
    elif request.method == 'PATCH':
        obj = request.get_json()
        if not v.validate(obj):
            abort(400, description=v.errors)
        # Note that this update function is specified in models.py
        if "password" in obj:
            current_user.set_password(obj['password'])
        current_user.update(obj) 
        db.session.commit()
        returnValue = jsonify(current_user.to_dict())
        db.session.close()
        return returnValue, 200
    elif request.method == 'DELETE':
        userDevice = Device.query.filter_by(user_id=current_user.get_id()).all()
        for o in userDevice:
            db.session.delete(o)
            db.session.flush()
        db.session.delete(current_user)
        db.session.commit()
        db.session.close()
        return '', 204

@bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        if not v.validate(request.get_json()):
            abort(400, description=v.errors)
        user_data = request.get_json()
        user_email = user_data['email']
        check_user = User.query.filter_by(email=user_email).first()
        if not check_user or not check_user.check_password(user_data['password']):
            #error handler, if login is not successful
            abort(403, description="The credentials you entered were incorrect")
        result = login_user(check_user)
        if(result):
            print("User Succesfully Logged In")
        db.session.close()
        if result:
            return '', 204
        else:
            return 'Unauthorized', 401

@bp.route('/user', methods=['POST'])
@login_required
def user_post():
    if request.method == 'POST':
        obj = request.get_json()
        if not v.validate(obj):
            abort(400, description=v.errors)
        myPassword = obj.pop('password', None)
        new_user = User(**obj)
        new_user.set_password(myPassword)
        db.session.add(new_user)
        db.session.commit()
        returnValue = jsonify(new_user.to_dict())
        db.session.close()
        print("New user added")
        return returnValue, 201
