# UdaciRacer Simulation Game

## Description

This is my version of the [Udacity Intermediate Javascript Nano Degree Asynchronus Project](https://github.com/udacity/nd032-c3-asynchronous-programming-with-javascript-project-starter).

This project does the following through a promise-based udaciRacer api:

* Allows user to select a race track and racer
* Start a race, accelerate and get live rank updates during the race
* And see final results after the race

My task as student on this project was to flesh out the use of fetch/promises to interact with the provided racer api and make other fixes/adjustments to the front-end code as needed.



## Running the Game

*Note: These steps are slightly modified form the original read me.*

WIth the code downloaded locally, we need to run two things to run the simulator: the game engine API server and the front end.

### Start the Server

The game engine has been compiled down to a binary so that you can run it on any system.

To run the server for the api, locate your operating system and run the associated command in your terminal at the root of the project.

| Your OS               | Command to start the API                                  |
| --------------------- | --------------------------------------------------------- |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux` |

Note that this process will use your terminal tab, so you will have to open a new tab and navigate back to the project root to start the front end.

#### WINDOWS USERS -- Setting Environment Variables
If you are using a windows machine:
1. `cd` into the root of the project containing data.json 
2. Run the following command to add the environment variable:
```set DATA_FILE=./data.json```


### Starting the Frontend

First, run your preference of `npm install && npm start` or `yarn && yarn start` at the root of this project. Then you should be able to access http://localhost:3000 in a browser.

### Starting your Engines...

Enjoy the race simulator ; )