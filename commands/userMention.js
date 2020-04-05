const Channel = require('../models/channel')
const Activity = require('../models/activity')
const User = require('../models/user')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), /<@([\w]+)>/gm, async ({ message, say, context }) => {
    if (message.text.indexOf(':beer:') == -1) return;

    const channel = await Channel.findOne({ channelId: message.channel, enabled: true })
    if (!channel) return;

    // console.log('message: ', message)
    // console.log('context', context)

    const currentUser = message.user
    const taggedUsers = []
    const taggedUserIds = []
    const beers = message.text.match(/:beer:/g).length

    context.matches.forEach(m => {
      const userId = m.replace(/[<@>]/g, '')
      // conditional to prevent use the current user id and bot user id
      if (userId !== currentUser && userId !== context.botUserId) {
        taggedUsers.push(m)
        taggedUserIds.push(userId)
      }
    })

    try {
      if (taggedUsers.length) {
        say(`Congratulations ${taggedUsers.join()}! 🎉`)
        
        const conversation = await app.client.conversations.info({
          token: context.botToken,
          channel: message.channel
        })
        // get updated channel's name
        channel.channelName = conversation.channel.name
        // get original message without user tags
        let userMessage = message.text.replace(/<@([\w]+)>/g, '')
        userMessage = userMessage.trim()
        // get current user info
        const currentUserData = await app.client.users.info({
          token: context.botToken,
          user: currentUser
        })
        // save current user info
        const currentUserInfo = await User.findOneAndUpdate(
          { userId: currentUser },
          { userProfile: currentUserData.user.profile },
          { upsert: true, new: true }
        )

        for(let i in taggedUserIds) {
          const userId = taggedUserIds[i]
          // get user info
          const userData = await app.client.users.info({
            token: context.botToken,
            user: userId
          })
          // save user info
          const userInfo = await User.findOneAndUpdate(
            { userId },
            { userProfile: userData.user.profile },
            { upsert: true, new: true }
          )
          
          // save user activity
          await Activity.create({
            channel: channel._id,
            teamId: message.team,
            userId: currentUser,
            user: currentUserInfo._id,
            userMentionedId: userId,
            userMentioned: userInfo._id,
            message: userMessage,
            beers: beers
          })
        }

        channel.save()
      }
    } catch (error) {
      console.error('command userMention:', error)
    }
  })
}