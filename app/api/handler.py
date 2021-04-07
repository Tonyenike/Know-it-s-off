import os
from flask import Flask, request
from config import Config
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.api import bp
from app import db
import json
from app.models import Device, BatteryLogger

#These variables define the battery voltages
#We can use these to calculate the battery power level
#as a percentage.
Vmax = 4.2
Vmin = 3.0

#We want to get the device iD, then modify the corresponding device
@bp.route('/updateState/<int:device_id>', methods=['PATCH'])
def device_data_post(device_id):
   if request.method == "PATCH":
      print("Receiving Device at ID: ", device_id)
      deviceStats = request.get_json()
      deviceStats = json.loads(deviceStats)
      #Set the time the state of the device changed to right now
      deviceStats['timestamp'] = datetime.now()      

      #Convert voltage to battery power.d
      deviceVoltage = deviceStats['device_battery']
      # (Vactual - Vmin) * 100
      # ______________________
      # (Vmax - Vmin)
      deviceVoltage = (deviceVoltage - Vmin) * 100
      deviceVoltage = deviceVoltage / (Vmax - Vmin)
      deviceVoltage = round(deviceVoltage, 1)
      deviceStats['device_battery'] = deviceVoltage

      #Select *
      #From Device
      #Where id = device_id
      #LIMIT 1
      myDevice = Device.query.filter_by(id=device_id).first()
      myDevice.update(deviceStats)

      myStamp = BatteryLogger()
      myStamp.device_battery = deviceStats['device_battery']
      myStamp.timestamp_time = deviceStats['timestamp']

      #This adds a battery log associated with the device's ID
      myDevice.battery_logger.append(myStamp)
      db.session.commit()
      return '', 200