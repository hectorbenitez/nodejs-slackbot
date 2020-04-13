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

    if (!channel) {
      return
    }

    const triviaGame = await TriviaGame.findOne({
      channel: channel._id
    }).populate('question')

    let nextQuestion = null
    if (
      message.text.toLowerCase() === triviaGame.question.answer.toLowerCase()
    ) {
      nextQuestion = await Question.random()
      triviaGame.question = nextQuestion._id
      if (!triviaGame.leaderboard) {
        triviaGame.leaderboard = {}
      }
      if (!triviaGame.leaderboard[message.user]) {
        triviaGame.leaderboard[message.user] = 0
      }
      triviaGame.leaderboard[message.user]++
      triviaGame.markModified('leaderboard')
      await triviaGame.save()
      await app.client.reactions.add({
        token: context.botToken,
        channel: message.channel,
        name: 'thumbsup',
        timestamp: message.ts
      })
    }

    if (nextQuestion) {
      await say(
        `Nice going <@${message.user}>, you have ${
          triviaGame.leaderboard[message.user]
        } points.`
      )
      setTimeout(
        async () => await say(`Next question: ${nextQuestion.question}`),
        1000
      )
    }
  })
}
