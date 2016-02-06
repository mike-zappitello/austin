### architecture so far:
* main: reads a configuration and calls austin, spawning ausitin, our bot.
* austin: the object that interacts with slack
  * 'owns' a context that keeps track of everythign austin needs to remember
  * has onOpen, onMessage, and onError methods to keep track of what is going
    on in the slack application.
    * onMessage currently calls an austin::parseMessage method, that should
      probably be written in another object.
    * onOpen calls out to console and has the scheduler start two jobs
    * onError just logs the error to console
  * TODO:
    * move parseMessage into its own class that stores all the regex's
    * move writting part of pasreMessgae into its own class the writes things
      out?
* context: stores the current state that austin knows about
  * creates a dict of teams by using nba.com's ids as keys
    * can (should) bring in data from other sources
    * needs an interface that can take in team abbrevs and names
    * context.updateStandings updates the teams records
  * creates a dict of games for that day, comes with method to update it
    * is update by context.updateGames()
    * uses context.gamesDate() to stringify day for games request
    * uses context.cleanup() to remove games from the dict for the next day
  * TODO:
    * create a dict of jobs that are currently running to turn them on and
          off and reschedule them.
    * add more data to teams, create dict for players?
    * create file for formatting this information into display stirngs?
* scheduler: collection of functions that create different jobs
  * watchGames - polls for the games being played every minute and updates the
    context object.
  * nightlyCleanup - resets the nbaContext object for the next day.
  * TODO:
    * use the created jobs to change their scheduling.
* nba_request: collection of functions to poll sites we can request
  * getPlayerStats
  * getPlayerVuStats
  * getTodaysGames


### things we need to do:
* settup collection of regex's we want to watch out for. create an object that
  executes all of them on a given string. watch them in austin.onMessage.
* ~~setup module to change user input into requests for nba data~~
* ~~add an enum for every team~~
* ~~figure out how to launch bot into our team~~
* ~~setup logging file~~
* setup a method for allowing testing from multiple sources
* add methods to slack client api to get reactions, send files, and download
  files
* setup a class that formats things for printing out to slack
* add emoji's for all teams and load them into context.teams

### features i know i want:
* pickem game where we display the games of the day in the morning, and it
  tracks who picked what games.
* get a blast of all articles from a list of rss feeds (prolly via request)
* post game reuslts somehow
* stats on demand by player / team (need to figure out a good interafce for
  this).
  * figured out player, team should be pretty trivial
* setup some analytics tools on the backend that we can generate charts from to
  display.
