const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), 'add-question', async ({ message, say, context }) => {
    const parts = message.text.split('||')
    const question = new Question({
      category: parts[1].trim(),
      question: parts[2].trim(),
      answer: parts[3].trim()
    })

    await question.save()
    say('Question saved')
  })
}
