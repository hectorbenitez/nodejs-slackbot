const { App } = require('@slack/bolt')
const Channel = require('./models/channel')
const Install = require('./models/install')

var mongoose = require('mongoose')
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
)

const authorizeFn = async ({ teamId, enterpriseId }) => {
  return Install.findOne({ teamId, enterpriseId }).then(install => {
    return {
      botToken: install.authData.bot.bot_access_token,
      botId: install.authData.bot.bot_id,
      botUserId: install.authData.bot.bot_user_id
    }
  })
}

// Initializes your app with your bot token and signing secret
const app = new App({
  authorize: authorizeFn,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

require('./commands')(app)

app.receiver.app.get('/oauth/redirect', async (req, res) => {
  console.log('It works!!!', req.query.code)
  const code = req.query.code
  app.client.oauth
    .access({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code
    })
    .then(async result => {
      console.log('result', result)
      if (result.ok) {
        let authData = {
          teamId: result.team_id,
          botUserId: result.bot.bot_user_id,
          botToken: result.bot.bot_access_token
        }
        data = await app.client.users.info({
          token: authData.botToken,
          user: authData.botUserId
        })
        if (data.ok) {
          result.bot.bot_id = data.user.profile.bot_id
          Install.create({
            enterpriseId: result.enterprise_id,
            teamId: result.team_id,
            authData: result
          })
        }
      }
    })
    .catch(error => console.log(error))

  res.sendStatus(200)
})
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
