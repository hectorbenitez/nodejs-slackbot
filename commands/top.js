const Channel = require('../models/channel')

module.exports = app => {
  const botId = 'UNWGTHC5C'

  app.message('top', ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    if (message.text.indexOf(botId) == 2) {
      // say(`Hey there <@${message.user}>! there is a list with the top users`);
      Channel.findOne({
        channelId: message.channel
      }).then(channel => {
        var arrayUsers = channel.users

        var keys = []
        for (var k in channel.users) keys.push(k)
        let len = keys.length
        for (let i = 0; i < len; i++) {
          for (let j = 0; j < len; j++) {
            if (arrayUsers[keys[j]] < arrayUsers[keys[j + 1]]) {
              let tmp = arrayUsers[keys[j]]
              arrayUsers[keys[j]] = arrayUsers[keys[j + 1]]
              arrayUsers[keys[j + 1]] = tmp
            }
          }
        }
        var messageToUser = ''
        for (let i = 0; i < len; i++) {
          messageToUser += `<@${keys[i]}>: ${arrayUsers[keys[i]]}\n`
        }
        say(
          `Hey there <@${message.user}>! there is a list with the top users\n` +
            messageToUser
        )
      })
    }
  })
}
