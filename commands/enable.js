const Channel = require('../models/channel')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), /enable [\w]+$/, async ({ message, say }) => {
    const command = message.text.match(/enable [\w]+$/)[0]
    const skillName = 'trivia'
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team
    })

    if (!channel) {
      channel = new Channel({
        channelId: message.channel,
        teamId: message.team,
        skills: []
      })
    }

    console.log()
    const skill = channel.skills.find(skill => skill.name === skillName)
    if (skill) {
      skill.enabled = true
    } else {
      channel.skills.push({
        name: skillName,
        enabled: true
      })
    }

    await channel.save()
    say(`HeyBeer has been enabled`)
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
