const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const { directMention } = require('@slack/bolt')

const startOptions = Object.freeze({
  TRIVIA: "trivia",
  SURVEY: "survey"
})

module.exports = app => {
  app.message(directMention(), 'start', async ({ message, say }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team
    })    

    const command = message.text.match(/start [\w]+$/)[0]
    const splitedCommand = command.split(" ")
    const startAction = splitedCommand[1]
    switch(startAction){

      case startOptions.SURVEY:
        say("Survey starting")
        break

      case startOptions.TRIVIA:
        const question = await Question.random()
        const triviaGame = await TriviaGame.findOne({
          channel: channel._id
        })
        triviaGame.question = question._id
        triviaGame.save()
        say(question.question)
        break

      default:
        say("Command not found, try trivia or survey")
        break
    }    
    
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
