# UdaciRacer Simulation Game

## Description

This is my version of the [Udacity Intermediate Javascript Nano Degree Asynchronus Project](https://github.com/udacity/nd032-c3-asynchronous-programming-with-javascript-project-starter).

This project does the following through a promise-based udaciRacer api:

* Allows user to select a race track and racer
* Start a race, accelerate and get live rank updates during the race
* And see final results after the race

My task as student on this project was to flesh out the use of **fetch/promises** to interact with the provided racer **api** and make other fixes/adjustments to the **front-end code** as needed.  It also utilizes **setInterval**.



## Downloading the Game

1. Download the repo code to a local folder

```bash
git clone https://github.com/djwilkins/udacity-nano-intermediate-js-async
```

## Starting the Game

1. In a terminal and from the local repo folder created above, run this to start the simulator api:

```bash
ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux
# NOTE: There are binaries for windows and mac also available  
```
2. In another terminal from the repo folder, run this to start the simulator front end:

```bash
npm install & npm start
# OR...
# yarn && yarn start
```

3. Open a browser and access the game at http://localhost:3000

## Starting your Engines...

Enjoy the race simulator!