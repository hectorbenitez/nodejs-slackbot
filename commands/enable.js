const Channel = require('../models/channel')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), 'enable', ({ message, say }) => {
    // console.log('message: ', message);
    Channel.findOneAndUpdate(
      { channelId: message.channel },
      {
        enabled: true,
        teamId: message.team,
      },
      { upsert: true }
    )
      .then(() => {
        say(`HeyBeer has been enabled`)
      })
      .catch(error => {
        console.error('command enable:', error)
        say(`Oops! We have a little problem enabling HeyBeer`)
      })
  })
}