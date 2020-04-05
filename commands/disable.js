const Channel = require('../models/channel')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), 'disable', ({ message, say }) => {
    Channel.findOneAndUpdate(
      { channelId: message.channel },
      { enabled: false },
      { upsert: true }
    )
      .then(() => {
        say(`HeyBeer has been disabled, if you want to enable, type 'enable'`)
      })
      .catch(error => {
        console.error('command disable:', error)
        say(`Oops! We had a little problem disabling HeyBeer`)
      })
  })
}