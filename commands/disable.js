const Channel = require('../models/channel')

module.exports = app => {
  app.message('disable', ({ message, say }) => {
    Channel.findOneAndUpdate(
      { channelId: message.channel },
      { enabled: false },
      { upsert: true }
    )
      .then(() => {
        say(`Bot disabled, if you want to enable, type 'enable'`)
      })
      .catch(err => {
        console.log('error disabling', err)
        say(`Bot can't disable :(`)
      })
  })
}