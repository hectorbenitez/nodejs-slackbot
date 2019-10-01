const Channel = require('../models/channel')

module.exports = app => {
  app.message('enable', ({ message, say }) => {
    console.log(message)
    Channel.findOneAndUpdate(
      { channelId: message.channel },
      { enabled: true },
      { upsert: true }
    )
      .then(() => {
        say(`Bot enabled`)
      })
      .catch(err => {
        console.log('error enabling', err)
        say(`Bot can't enable :(`)
      })
  })
}