const Channel = require('./../models/channel')

module.exports = app => {
  app.message('karma', 'mention', ({ message, say }) => {
    const requestMessage = message.text
    const startPos = requestMessage.indexOf('<@') + 2
    const endPos = requestMessage.indexOf('>', startPos)
    const idUser = requestMessage.substring(startPos, endPos)
    console.log(message.text)

    const karmaInfo = Channel.findOne({
      channelId: message.channel
    }).then(channel => {
      console.log(channel)
      console.log(channel.users ? channel.users[idUser] : 0)
      say(`User karma is: ${channel.users ? channel.users[idUser] : 0}`)
    })
  })
}