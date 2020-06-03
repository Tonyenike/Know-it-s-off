from flask import request, abort, jsonify
from sqlalchemy import text
from . import routes
import sys
sys.path.append('../..')
from main import db
from models import *
from cerberus import Validator
from flask_login import login_required, current_user

user_schema = {
                    "first_name": {"type": "string", "maxlength": 64, "nullable": True}, 
                    "last_name": {"type": "string", "maxlength": 64, "nullable": True}, 
                    "phone_number": {"type": "integer", "min": 0, "max": 10000000000, "nullable": True},
                    "email": {"type": "string", "maxlength": 64, "nullable": True}
                   }


v = Validator(user_schema, allow_unknown=True)

@routes.route('/users', methods=['POST'])
def users_post():
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

@routes.route('/users/<id>', methods=['GET', 'PATCH', 'DELETE'])
@login_required
def users_get_patch_delete_by_id(id):
    #Note that id here is garbage. Use current_user.get_id() instead
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
        #must delete all constraints first (all permission table entries)
        #should probably delete all the corresponding appliances/scouts
        #otherwise they will be stuck in the db. First scouts then appliances
        permScout = Permission_User_Scout.query.filter_by(user_id=current_user.get_id()).all()
        for o in permScout:
            db.session.delete(o)
            db.session.flush()
        userScout = Scout.query.outerjoin(Permission_User_Scout, Scout.id == Permission_User_Scout.scout_id).filter_by(user_id=current_user.get_id()).all()
        for o in userScout:
            db.session.delete(o)
            db.session.flush()
        permApp= Permission_User_Appliance.query.filter_by(user_id=current_user.get_id()).all()
        for o in permApp:
            db.session.delete(o)
            db.session.flush()
        mess = MessageQueue.query.outerjoin(Permission_User_Appliance, MessageQueue.appliance_id == Permission_User_Appliance.appliance_id).filter_by(user_id=current_user.get_id()).all()
        for o in mess:
            db.session.delete(o)
            db.session.flush()
        userApp = Appliance.query.outerjoin(Permission_User_Appliance, Appliance.id == Permission_User_Appliance.appliance_id).filter_by(user_id=current_user.get_id()).all()
        for o in userApp:
            db.session.delete(o)
            db.session.flush()
        db.session.delete(current_user)
        db.session.commit()
        db.session.close()
        return '', 204
