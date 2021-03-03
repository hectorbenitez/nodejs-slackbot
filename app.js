const { App, ExpressReceiver } = require('@slack/bolt')
const mongoose = require('mongoose')
const Team = require('./models/team')
const cors = require('cors')
require('dotenv').config()
// Mongoose connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const authorizeFn = async ({ teamId, enterpriseId }) => {
  return Team.findOne({ teamId, enterpriseId }).then(team => {
    return {
      botToken: team.accessToken,
      botId: team.botId,
      botUserId: team.botUserId
    }
  })
}

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// Initialize app with our signing secret
const app = new App({
  authorize: authorizeFn,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

// use CORS
receiver.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  })
)

require('./routes')(receiver)
require('./commands')(app)
require('./actions')(app)

;(async () => {
  // Start app
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
