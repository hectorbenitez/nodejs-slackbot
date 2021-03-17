const Channel = require("../models/channel");
const Question = require("../models/question");
const SurveySession = require("../models/surveySession");
const { createBlockKitQuestion } = require("./../services/blockKitBuilder");
const { getNextIndex } = require('./../services/surveySessionManager');

module.exports = (app) => {
  app.action(
    /survey-answer-(\d)/,
    async ({ ack, body, action, context, say, client }) => {
      // console.log(body, action, context);
      await ack();

      const surveySession = await SurveySession.findOne({
        slackUser: body.user.id,
        isCompleted: false,
      });
      if (!surveySession) {
        return say("You are not answering a survey");
      }

      const answerValue = action.value.split("-");
      const questionIndex = answerValue[2];
      const answer = answerValue[3];
      let requireNewQuestion = false;

      surveySession.questions[questionIndex].answer = answer;

      // console.log(questionIndex, surveySession.index)
      if (questionIndex == surveySession.index) {
        surveySession.index = getNextIndex(surveySession);
        requireNewQuestion = true;
      }

      if (surveySession.index === surveySession.questions.length) {
        surveySession.isCompleted = true;
      }
      await surveySession.save();

      const result = await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: createBlockKitQuestion(
          surveySession,
          questionIndex,
          answer
        ),
      });

      // console.log({
      //   channel: body.channel.id,
      //   ts: body.message.ts,
      //   text: "Updated",
      //   result,
      // });

      if (surveySession.isCompleted) {
        return await say('Thank you to completing the survey! We really appreciate your time. If you have any feedback, let us know <@UFDF3F8GN> or <@U01DD27GE0J>');
      }

      console.log(questionIndex, surveySession.index)
      if (requireNewQuestion) {
        const message = await say({
          blocks: createBlockKitQuestion(surveySession, surveySession.index),
        });
        surveySession.questions[surveySession.index].ts = message.ts;
        surveySession.save();
        console.log("new message", message);
      }
    }
  );
};
