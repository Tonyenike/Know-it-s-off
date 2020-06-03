# Download the helper library from https://www.twilio.com/docs/python/install
from twilio.rest import Client
import constants

def check_phone_number(phone_number):
    if not (len(str(phone_number)) == 10):
        print("Error! Phone number is not 10 digits. Exiting")
        return 1
    else:
        return 0

def send_message(phone_number=5037017527, message="Your appliance has been left on!"):
    if check_phone_number(phone_number):
        return
    account_sid = constants.twilio_sid
    auth_token = constants.twilio_token
    client = Client(account_sid, auth_token)


    message = client.messages \
                .create(
                     body=message,
                     from_='+12018553523',
                     to='+1' + str(phone_number)
                 )

def add_new_number(phone_number):
    if check_phone_number(phone_number):
        return
    account_sid = constants.twilio_sid
    auth_token = constants.twilio_token
    client = Client(account_sid, auth_token)
    validation_request = client.validation_requests \
                           .create(

                                friendly_name=str(phone_number),
                                phone_number='+1' + str(phone_number)
                            )    
