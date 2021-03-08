const Survey = require("../models/survey");
const SurveySession = require("../models/surveySession");
const { createBlockKitQuestion, createSurveyHeader } = require('./../services/blockKitBuilder');
const { directMention } = require("@slack/bolt");


module.exports = (app) => {
  app.message(directMention(), "send-survey", async ({ message, say, client }) => {
    const command = message.text;
    const splitedCommand = command.replace(/\s/g,' ').split(" ");

    const userId = splitedCommand[3].replace(/<|>|@/g, '');
      
    const surveyName = splitedCommand[2];
    const survey = await Survey.findOne({ surveyName });
    if(!survey){
      return await say("Survey not found");
    }


    let surveySession = await SurveySession.findOne({ slackUser: userId, isCompleted: false });
    if (surveySession) {
      return await say('user already answering a survey');
    }
    surveySession = new SurveySession();
    surveySession.slackUser = userId;
    surveySession.survey = survey;
    surveySession.questions = survey.questions.map(({ question, type, context }) => ({
      question,
      type,
      context,
    }));
    surveySession.save();

    await say('survey sent');

    await client.chat.postMessage({
      channel: userId,
      blocks: createSurveyHeader(survey.surveyName, survey.welcomeMessage)
    });

    await client.chat.postMessage({
      channel: userId,
      blocks: createBlockKitQuestion(surveySession.questions[0], 0)
    });
  });
};
