Slack = require 'slack-client'

slackToken = ''
autoReconnect = true
autoMark = true

slack = new Slack(slackToken, autoReconnect, autoMark)

slack.on 'open', ->
  console.log "Connected to #{slack.team.name} as @#{slack.self.name}"

slack.on 'message', (message) ->
  console.log message

slack.on 'error', (error) ->
  console.log "Error", err

slack.login()
