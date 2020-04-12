const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const noDirectMention = require('../middlewares/noDirectMention')

module.exports = app => {
  app.message(noDirectMention, /.+/, async ({ message, say, context }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team
    })

    const triviaGame = await TriviaGame.findOne({
      channel: channel._id
    }).populate('question')

    let emoji = 'thumbsdown'
    let nextQuestion = null

    if(message.text === triviaGame.question.answer) {
      emoji = 'thumbsup'
      nextQuestion = await Question.random()
      triviaGame.question = nextQuestion._id
      await triviaGame.save()
    }

    await app.client.reactions.add({
      token: context.botToken,
      channel: message.channel,
      name: emoji,
      timestamp: message.ts
    })

    if (nextQuestion) {
      await say(nextQuestion.question)
    }
  })
}