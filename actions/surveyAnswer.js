const Channel = require("../models/channel");
const Question = require("../models/question");
const SurveySession = require("../models/surveySession");
const { directMention } = require("@slack/bolt");

module.exports = (app) => {
  app.action(
    /survey-answer-(\d)/,
    async ({ ack, body, action, context, say, client }) => {
      console.log(body, action, context);
      await ack();

      const surveySession = await SurveySession.findOne({
        slackUser: body.user.id,
        isCompleted: false,
      });
      if (!surveySession) {
        return say("You are not answering a survey");
      }

      const answerValue = action.value.split('-');
      const questionIndex = answerValue[1];
      const answer = answerValue[2];
      
      surveySession.questions[questionIndex].answer = answer;
      surveySession.index++;

      if (surveySession.index === surveySession.questions.length) {
        surveySession.isCompleted = true;
      }
      await surveySession.save();

      const result = await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: createBlockKitQuestion(
          surveySession.questions[questionIndex],
          questionIndex,
          answer
        ),
      });

      console.log({
        channel: body.channel.id,
        ts: body.message.ts,
        text: "Updated",
        result,
      });

      if (surveySession.isCompleted) {
        return await say("Thanks!");
      }

      const question = surveySession.questions[surveySession.index];

      const message = await say({
        blocks: createBlockKitQuestion(question, surveySession.index),
      });
      console.log("new message", message);
    }
  );
};

function createBlockKitQuestion(question, index, answerSelected = null) {
  const likertAnswers = [
    "Never",
    "Almost Never",
    "Sometimes",
    "Almost Always",
    "Always",
  ];

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Question: ${question.question}`,
      },
    },
    {
      type: "actions",
      elements: likertAnswers.map((answer, idx) => {
        const button = {
          type: "button",
          action_id: `survey-answer-${idx}`,
          value: `answer-${index}-${answer}`,
          text: {
            type: "plain_text",
            emoji: true,
            text: answer,
          },
        };

        if(answerSelected === answer) {
          button.style = 'primary'
        }

        return button;
      }),
    },
  ];
}
