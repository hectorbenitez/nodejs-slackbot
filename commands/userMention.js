const Channel = require('../models/channel')

module.exports = app => {
  app.message('<@', ({ message, say }) => {
    console.log(message)
    Channel.findOne({ channelId: message.channel }).then(channel => {
      var t = message.text.split('> ')
      if (t.length > 1) {
        var user = t[0].substr(2, t[0].length)
        var action = t[1].trim()
      }
  
      if (!channel.users) {
        channel.users = {};
      }
  
      if (!channel.users[user]) {
        channel.users[user] = 0
      }
  
      console.log(channel)
      if (action[0] == '+') {
        channel.users[user]++
        say(`User <@${user}> Received ${action.length - 1} Karma points`)
      } else {
        if (action[0] == '-') {
          channel.users[user]--
          say(
            `User <@${user}> Received minus ${action.length - 1} Karma points`
          )
        }
      }
  
      channel.markModified('users')
      channel.save()
    })
  })
}