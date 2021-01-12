from flask import request, abort, jsonify
from flask_login import login_required, current_user
from app.api import bp
from app.models import Device
from app import db
from cerberus import Validator


device_schema = {
                    "appliance_name": {"type": "string", "maxlength": 64, "nullable": True}, 
                    "device_state": {"type": "integer", "default": False, "nullable": False},
                    "device_battery": {"type": "float", "nullable": True}, # float change position reminder
                    "timestamp": {"type": "datetime", "nullable": False}
}

v = Validator(device_schema, allow_unknown=True)

@bp.route('/device/<id>', methods=['GET', 'PATCH', 'DELETE'])
@login_required
def device_get_patch_delete_by_id(id):
    myDevice = device.filter_by(scout_id=id, user_id=current_user.get_id()).first()
    if request.method == 'GET':
        returnValue = jsonify(myDevice.to_dict())
        db.session.close
        return returnValue, 200
    elif request.method == 'PATCH':
        if not v.validate(request.get_json()):
            abort(400, description=v.errors)
        myDevice.update(request.get_json())
        db.session.commit()
        returnValue = jsonify(myDevice.to_dict())
        db.session.close()
        return returnValue, 200
    elif request.method == 'DELETE':
        db.session.delete(myDevice)
        db.session.commit()
        db.session.close()
        return '', 204

@bp.route('/device', methods=['POST', 'GET'])
#@login_required
def device_get_post():
    if request.method == 'POST':
        if not v.validate(request.get_json()):
            abort(400, description=v.errors)
        request.get_json().pop("id", None)
        new_device = Device(**request.get_json())
        db.session.add(new_device)
        db.session.commit()
        add_user_device(new_device.id)
        myobj = new_device.to_dict()
        db.session.close()
        return jsonify(myobj), 201
    elif request.method == 'GET':
        results = Device.query
        myList = []
        for row in results:
            myList.append(row.to_dict())
        db.session.close()
        return jsonify(myList), 200

def add_user_device(device_id):
    user_id = current_user.get_id()
    new_user_device.user_id = user_id
    new_user_device.device_id = device_id
    db.session.add(new_user_device)
    db.session.commit()
    return jsonify(new_user_device.to_dict())