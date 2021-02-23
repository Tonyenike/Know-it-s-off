from app import app, db
from app.models import User, Device
#from waitress import serve

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Device': Device}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
