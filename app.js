const { App } = require('@slack/bolt')
const Channel = require('./models/channel')

var mongoose = require('mongoose')
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
)

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

require('./commands')(app)

;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
