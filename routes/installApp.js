const Team = require('../models/team')
require('dotenv').config()

module.exports = app => {
  app.receiver.app.get('/oauth/redirect', async (req, res) => {
    // console.log('It works!!!', req.query.code)
    const code = req.query.code
    app.client.oauth.v2
      .access({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code
      })
      .then(async response => {
        console.log('response', response)
        if (response.ok) {
          const botData = await app.client.users.info({
            token: response.access_token,
            user: response.bot_user_id
          })

          // console.log('botData', botData)
          if (botData.ok) {
            await Team.create({
              appId: response.app_id,
              teamId: response.team.id,
              teamName: response.team.name,
              enterpriseId: response.enterprise_id,
              authedUserId: response.authed_user.id,
              accessToken: response.access_token,
              botUserId: response.bot_user_id,
              botId: botData.user.profile.bot_id,
            })

            console.log(`Bot registered successfully`)
          }
        }
      })
      .catch(error => console.log(error))
  
    res.sendStatus(200)
  })
}