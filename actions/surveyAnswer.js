const Channel = require("../models/channel");
const Question = require("../models/question");
const SurveySession = require("../models/surveySession");
const { createBlockKitQuestion } = require("./../services/blockKitBuilder");
const { getNextIndex } = require('./../services/surveySessionManager');

module.exports = (app) => {
  app.action(
    /survey-answer-(\d)/,
    async ({ ack, body, action, context, say, client }) => {
      await ack();

      const surveySession = await SurveySession.findOne({
        slackUser: body.user.id,
        isCompleted: false,
      });
      if (!surveySession) {
        return say("You are not answering a survey");
      }
      let answerValue = '';
      let questionIndex = '';
      let answer = '';
      if(action.value){ //free text
        answerValue = action.value?.split("-");
        questionIndex = answerValue[2];
        answer = answerValue[3];
      }else if(action.selected_option?.value){ // radio buttons
        answerValue = action.selected_option?.value.split("-")
        questionIndex = answerValue[2];
        answer = answerValue[3];
      }else if(action.selected_options?.length){ // checkboxes
        questionIndex = action.selected_options[0].value.split("-")[2];
        answer = action.selected_options.map(option => option.value.split("-")[3]).join(', ');
      }
      let requireNewQuestion = false;

      surveySession.questions[questionIndex].answer = answer;

      if (questionIndex == surveySession.index) {
        surveySession.index = getNextIndex(surveySession);
        requireNewQuestion = true;
      }

      if (surveySession.index === surveySession.questions.length) {
        surveySession.isCompleted = true;
      }
      await surveySession.save();

      if(action.value){ //only for free text
        await client.chat.update({
          channel: body.channel.id,
          ts: body.message.ts,
          blocks: createBlockKitQuestion(
            surveySession,
            questionIndex,
            answer
          ),
        });
      }

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
