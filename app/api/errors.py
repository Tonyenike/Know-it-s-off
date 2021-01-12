from flask import jsonify
from werkzeug.http import HTTP_STATUS_CODES
from app.api import bp

#TODO add SQL translations to every function

def bad_request():
    return error_response(400, message)

def error_response(status_code, message=None):
    payload = {'error': HTTP_STATUS_CODES.get(status_code, 'Unknown error')}
    if message:
        payload['message'] = message
    response = jsonify(payload)
    response.status_code = status_code
    return response