const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), 'leaderboard', async ({ message, say, context }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team
    })

    const triviaGame = await TriviaGame.findOne({
      channel: channel._id
    })

    const blocks =[];
    Object.keys(triviaGame.leaderboard).forEach(user => {
      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `<@${user}>: ${triviaGame.leaderboard[user]} points.`
        }
      })
    })

    say({
      blocks
    })
  })
}
