from flask import request, abort, jsonify
from . import routes
import sys
sys.path.append('../..')
from main import db
from models import *
from cerberus import Validator
from flask_login import login_required, current_user

appliance_schema = {
                    "name": {"type": "string", "maxlength": 64, "nullable": True}, 
                    "type": {"type": "string", "maxlength": 64, "nullable": True},
                    "status": {"type": "boolean", "nullable": True}
                   }


v = Validator(appliance_schema, allow_unknown=True)

@routes.route('/appliances', methods=['POST','GET'])
@login_required
def appliances_get_post():
    if request.method == 'POST':
        if not v.validate(request.get_json()):
            abort(400, description=v.errors)
        new_appliance = Appliance(**request.get_json())
        db.session.add(new_appliance)
        db.session.commit()
        myobj = new_appliance.to_dict()
        db.session.close()
        return jsonify(myobj), 201
    elif request.method == 'GET':
        print(current_user)
        results = db.session.query(Appliance, Scout).outerjoin(Scout, Appliance.id == Scout.appliance_id).all()
        myList = []
        for row in results:
            my_dict = row[0].to_dict()
            if row[1]:
                my_dict["scout"] = row[1].to_dict()
            else:
                my_dict["scout"] = None
            myList.append(my_dict)
        db.session.close()
        return jsonify(myList), 200

@routes.route('/appliances/<id>', methods=['GET', 'PATCH', 'DELETE'])
@login_required
def appliances_get_patch_delete_by_id(id):
    myAppliance = Appliance.query.get(id)
    if myAppliance is None:
        db.session.close()
        abort(404, description="This appliance does not exist")
    if request.method == 'GET':
        myobj = myAppliance.to_dict()
        db.session.close()
        return jsonify(myobj), 200
    elif request.method == 'PATCH':
        if not v.validate(request.get_json()):
            db.session.close()
            abort(400, description=v.errors)
        # Note that this update function is specified in models.py
        myAppliance.update(request.get_json()) 
        db.session.commit()
        myobj = myAppliance.to_dict()
        db.session.close()
        return jsonify(myobj), 200
    elif request.method == 'DELETE':
        db.session.delete(myAppliance)
        db.session.commit()
        db.session.close()
        return '', 204
