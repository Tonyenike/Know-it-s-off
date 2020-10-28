# Know-its-off

Directions for use:

#Prereq's for setting up
Make sure you have yarn installed on your computer before you start. If you installed yarn through npm, make sure you run the command `yarn` first to finish set up.

First, you need to check your database settings in `database_config.py` and define your database login credentials in `constants.py`. We have created an example of `constants.py` with the `example-constants.py` file.

You can setup an OSU database through your ONID account, everyone gets one.

`python3 -m pip install -r requirements.txt --user`

then go into the `myClient` directory 
edit .env with the appropriate baseURL address for the api server

and run 
`yarn build`

To run the server, type
`yarn start`

If you get some PATH problems, you may have to edit the package.json file.
https://stackoverflow.com/questions/60234640/typeerror-err-invalid-arg-type-the-path-argument-must-be-of-type-string-re


## Yarn

`yarn` is a package management tool for javascript libraries. To learn more about Yarn, you can view their [webpage](https://classic.yarnpkg.com/en/). In order to get started using Yarn, you can [look here](https://classic.yarnpkg.com/en/docs/getting-started).

## Project structure

This project is organized into 3 stacks -- the front-end, 
the back-end, and the database. Using 
[Flask blueprints](https://flask.palletsprojects.com/en/1.1.x/blueprints/), 
we register different paths which specify access
to different resources on the server. 
All the paths can be found in the `routes` directory. 
The front end is a
[single-page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) 
using [React](https://reactjs.org/). 
Javascript is built and compiled into the `myClient/build` directory, 
which is where all statically served files are sent from.


## License

[MIT License](https://github.com/Tonyenike/Know-its-off/blob/master/LICENSE.md)
