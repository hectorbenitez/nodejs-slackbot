const { WebClient } = require('@slack/web-api')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Survey = require('../models/survey')
const SurveySession = require('../models/surveySession')
const { createSurveyReminder, createBlockKitQuestion, createSurveyHeader } = require('../services/blockKitBuilder');
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
      considerCompleted: false,
      createdAt: { $lte: threshold }
    }).populate({
      path: "survey",
      populate: { path: "team"}
    });
  
    let surveySessions = incompleteSurveys
      .filter(surveySession => surveySession.survey.slug === 'wellbeing2023')

    for(let i=0; i<surveySessions.length; i++){
      let surveySession = surveySessions[i];
      const percentage = Math.round(surveySession.index * 100 / surveySession.questions.length);
        
      try{
        await slackClient.chat.postMessage({
          channel: surveySession.slackUser,
          blocks: createSurveyReminder(surveySession.survey.reminderMessage, `${percentage}%`),
          token: surveySession.survey.team.accessToken
        })
        if(surveySession.index === 0){
          await slackClient.chat.postMessage({
            channel: surveySession.slackUser,
            blocks: createSurveyHeader(surveySession.survey.surveyName, surveySession.survey.welcomeMessage),
            token: surveySession.survey.team.accessToken
          });
        }
        const result = await slackClient.chat.postMessage({
          channel: surveySession.slackUser,
          blocks: createBlockKitQuestion(surveySession, surveySession.index),
          token: surveySession.survey.team.accessToken
        })
        surveySession.questions[surveySession.index].ts = result.ts;
        await surveySession.save();

      }catch(err){
        console.log(`error sending reminder question to user ${surveySession.userName}`, err)
        console.log('error', err.data)
      }

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      })
    }
    console.log('survey reminder done');
    process.exit(0);
  })




