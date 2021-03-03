const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.action(/survey-answer-(\d)/, async ({ ack, body, action, context, say }) => {
    console.log(body, action, context)
    ack();
    say('Test')
  })
}
