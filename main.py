from app import app, db
from app.models import User, Device
#from waitress import serve

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Device': Device}
