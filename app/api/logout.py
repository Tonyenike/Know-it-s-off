from flask_login import login_required, logout_user
from app import db
from app.api import bp
from app.api.auth import token_auth

@bp.route('/logout')
@token_auth.login_required
def logout():
    logout_user()
    db.session.close()
    return redirect('/login')