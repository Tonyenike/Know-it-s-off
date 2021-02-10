from flask import Flask
from flask_assistant import Assistant, ask, tell
from app import assist, db
from app.models import User, Device
from flask_login import login_required, current_user, login_user




@assist.action('Initial')
def initial():
    speech = "Please Provide your Email Address to Connect to Know It's Off"
    return ask(speech)

@assist.action('Authentication')
def auth(user_email):
    print(user_email)
    check_user = User.query.filter_by(email=user_email).first()
    result = login_user(check_user, force=True)
    db.session.close()
    if result:
        speech = "Which device Do you want to know the state of?"
        return ask(speech), 204
    else:
        speech = "We couldn't find your email"
        return tell(speech), 401

### Tutorial

@assist.action('greeting')
def greet_and_start():
    speech = "Hey! Are you male or female?"
    return ask(speech)

@assist.action("give-gender")
def ask_for_color(gender):
    if gender == 'male':
        gender_msg = 'Sup bro!'
    else:
        gender_msg = 'Haay gurl!'

    speech = gender_msg + ' What is your favorite color?'
    return ask(speech)

@assist.action('give-color', mapping={'color': 'sys.color'})
def ask_for_season(color):
    speech = 'Ok, {} is an okay color I guess'.format(color)
    return ask(speech)
