const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), 'start', async ({ message, say }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team
    })

    const question = await Question.random()
    const triviaGame = await TriviaGame.findOne({
      channel: channel._id
    })

    triviaGame.question = question._id
    triviaGame.save()
    say(question.question)
  //   // console.log('message: ', message);
  //   Channel.findOneAndUpdate(
  //     { channelId: message.channel },
  //     {
  //       enabled: true,
  //       teamId: message.team
  //     },
  //     { upsert: true }
  //   )
  //     .then(() => {
  //       say(`HeyBeer has been enabled`)
  //     })
  //     .catch(error => {
  //       console.error('command enable:', error)
  //       say(`Oops! We have a little problem enabling HeyBeer`)
  //     })
  })
}
