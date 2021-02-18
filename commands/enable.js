const Channel = require('../models/channel')
const TriviaGame = require('../models/triviaGame')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), /enable [\w]+$/, async ({ message, say }) => {
    
    const command = message.text.match(/enable [\w]+$/)[0]
    const splitedCommand = command.split(" ")
    const skillName = splitedCommand[1]

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
    say(`Skill ${skillName} has been enabled`)

    if (skillName === 'trivia') {
      const triviaGame = new TriviaGame({
        channel: channel._id,
        question: null
      })
      triviaGame.save()
    }
  })
}
