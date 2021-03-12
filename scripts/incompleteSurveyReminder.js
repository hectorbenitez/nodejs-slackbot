const { App } = require('@slack/bolt')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Survey = require('../models/survey')
const SurveySession = require('../models/surveySession')
const { createSurveyReminder } = require('../services/blockKitBuilder');
require('dotenv').config()
// Mongoose connection

const authorizeFn = async ({ teamId, enterpriseId }) => {
  return Team.findOne({ teamId, enterpriseId }).then(team => {
    return {
      botToken: team.accessToken,
      botId: team.botId,
      botUserId: team.botUserId
    }
  })
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
    // Initialize app with our signing secret
    const app = new App({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      token: process.env.SLACK_BOT_TOKEN,
    })

    const tolerance = process.env.REMINDER_TOLERANCE || 86400000; // one day
    const threshold = new Date(new Date().getTime() - tolerance);
    const incompleteSurveys = await SurveySession.find({
      isCompleted: false, 
      createdAt: { $lte: threshold }
    }).populate({
      path: "survey",
      populate: { path: "team"}
    });
  
    const promises = incompleteSurveys.map(surveySession => {
      const percentage = Math.round(surveySession.index * 100 / surveySession.questions.length);
      return app.client.chat.postMessage({
          channel: surveySession.slackUser,
          blocks: createSurveyReminder(surveySession.survey.reminderMessage, `${percentage}%`),
          token: surveySession.survey.team.accessToken
        })
        .catch(err => {
          console.log(`error sending reminder to user ${surveySession.userName}`, err)
          console.log('error', err.data)
        })
    })
    Promise.all(promises)
      .finally(() => {
        console.log('survey reminder sent');
        process.exit(0);
      })
  })




