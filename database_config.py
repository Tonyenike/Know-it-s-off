from sqlalchemy.pool import NullPool, SingletonThreadPool, StaticPool  # does not work without NullPool, why?
import constants
import sqlalchemy




################
# This object creates a new database object which connects to the target database. It connects using the credentials
# from the credentials.py file
#
################
class Config(object):
    # The below code does not work as expected: host is set to localhost instead of desired host.
    #    SQLALCHEMY_DATABASE_URI = sqlalchemy.engine.url.URL(
    #        drivername="mysql+pymysql",
    #        username=constants.username,
    #        password=constants.password,
    #        database=constants.database,
    #        hostname=constants.host
    #    )

    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://" + constants.username + ":" + constants.password + "@" + constants.host + "/" + constants.database

    SQLALCHEMY_ENGINE_OPTIONS = {
        # "pool_size": 1,
        "poolclass": SingletonThreadPool
        # "max_overflow": 0
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
