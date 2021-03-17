const { WebClient } = require('@slack/web-api')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Survey = require('../models/survey')
const SurveySession = require('../models/surveySession')
const { createSurveyReminder } = require('../services/blockKitBuilder');
require('dotenv').config()

// Mongoose connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
    const slackClient = new WebClient();

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
      
      return slackClient.chat.postMessage({
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




