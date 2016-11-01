### how to install
Austin is written using the Node.js framework. Check to see if you have it on
your system with `node --version`. I'm currently using 5.5.0, but I don't think
there is anything specific to that version that we need. If you need a download,
you can find it [here](https://nodejs.org/en/download/)

The Node Package Manager (npm) comes installed with node. You can check its
instillation with `npm --version`. Now you're ready to install the packages
Austin depends on.

On the command line, change into the top level directory of this github project,
where this README lives. Running `npm install` will read the dependencies
described in [package.json](../blob/master/package.json) and download them for
you.

The bot is started with the [main.js](../blob/master/main.js) file. To start the
bot up, you will need a slack token. The configuration can also contain info on
other sources of data we might want to pull in.

For dev work, I want to have a setup where you can run tests instead of
launching the app in a slack client itself. To that end, I wrote a
[test script](../blob/master/test/listenerTest.js) that will take a listener and 
message as arguments and print out what the response. More tests should be
written as needs appear.

### architecture so far:
* main: spawns ausitin, our bot using a passed in config.
* config: reads a configuration file and creates an ausing configuration object
* austin: the object that interacts with slack
  * creates a logging file based on the passed in configuration
  * creates a web client that is used to post messages and info about a slack
    session
  * creates a message parser that can takes a message and composes a response
  * creates a RealTimeMessaging (RTM) client that is able to watch for events
    that happen in a slack session and execute functions when specific events
    occur. 
* messageParser: contains an array of listeners. checks a message against them.
  * exports listeners from the [listeners directory](../blob/master/lib/messageListeners/).
  * listeners are fairly quick to create. they need two functions
    * handle - takes a message and pulls out any info needed for response
    * composeResponse - take info from handle and create response to post
* scheduler: utility to schedule daily tasks. currently unused.
* nbaRequest: collection of functions to poll nba.com for statistics.

### things we need to do:
* ~~setup module to change user input into requests for nba data~~
* ~~add an enum for every team~~
* add methods to slack client api to get reactions, send files, and download
* setups a tool to use team emojis if they exist and team abbrevs if not
* expand params that are used to poll for statistics.
  * get per36 | perGame | total stats
  * get stats by season
  * get stats in last game
* put more work from austin.js to configuration.js where we're setting up how
  utilities are to be created.
* create an object that has all of our sorces of data (nbaDotCom, seatgeek,
  twitter) that can be passed around. add tests using this object.
* make message parser not dependent on the web client so tests can becom easier
  to write.

### features i know i want:
* pickem game where we display the games of the day in the morning, and it
  tracks who picked what games.
* highlights that show the latest cool thing a player did. (eg `highlights
  lebron` would add an inline gif / video of a dunk from today)
* setup some analytics tools on the backend that we can generate charts from to
  display.
* request stats by team
* seatgeek client that posts deals on game days
