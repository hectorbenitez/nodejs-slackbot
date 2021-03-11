const Survey = require("../models/survey");
const SurveySession = require("../models/surveySession");
const { createBlockKitQuestion, createSurveyHeader } = require('./../services/blockKitBuilder');
const { directMention } = require("@slack/bolt");


module.exports = (app) => {
  app.message(directMention(), "send-survey", async ({ message, say, client }) => {
    const command = message.text;
    const splitedCommand = command.replace(/\s/g,' ').split(/\s+/);

    const slug = splitedCommand[2];
    const survey = await Survey.findOne({ slug });
    if(!survey){
      return await say("Survey not found");
    }    

    const notSentTo = [];
    const sentTo = [];
    for(let i=3; i<splitedCommand.length; i++){
      const userId = splitedCommand[i].replace(/<|>|@/g, '');
      let surveySession = await SurveySession.findOne({ slackUser: userId, isCompleted: false });
      if (surveySession) {
        notSentTo.push(userId);
        continue;
      }
      const { user: { profile: { real_name, email } } } = await client.users.info({
        user: userId
      });
      surveySession = new SurveySession();
      surveySession.slackUser = userId;
      surveySession.userName = real_name;
      surveySession.userEmail = email;
      surveySession.survey = survey;
      surveySession.questions = survey.questions.map(({ question, type, context }) => ({
        question,
        type,
        context,
      }));
      surveySession.save();
      await client.chat.postMessage({
        channel: userId,
        blocks: createSurveyHeader(survey.surveyName, survey.welcomeMessage)
      });
      const result = await client.chat.postMessage({
        channel: userId,
        blocks: createBlockKitQuestion(surveySession, 0)
      });
      surveySession.questions[0].ts = result.ts;
      surveySession.save();
      sentTo.push(userId);
    }
    if(sentTo.length){
      await say(`survey sent to: ${sentTo.map(u => `<@${u}>`).join(' ')}`);
    }
    if(notSentTo.length){
      await say(`survey already started for users:  ${notSentTo.map(u => `<@${u}>`).join(' ')}`);
    }
    
  });
};
