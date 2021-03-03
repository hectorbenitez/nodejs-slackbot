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

      console.log(body.user.id, surveySession);
      surveySession.questions[surveySession.index].answer = action.value;
      surveySession.index++;

      if (surveySession.index === surveySession.questions.length) {
        surveySession.isCompleted = true;
      }
      await surveySession.save();

      const result = await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: createBlockKitQuestion(
          surveySession.questions[surveySession.index - 1],
          true
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
  if (answerSelected) {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Question: ${question.question}`,
        },
      },
    ];
  }
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
      elements: [
        {
          type: "button",
          action_id: "survey-answer-0",
          value: `answer_${index}_0`,
          text: {
            type: "plain_text",
            emoji: true,
            text: "Never",
          },
        },
        {
          type: "button",
          action_id: "survey-answer-1",
          value: `answer_${index}_1`,
          text: {
            type: "plain_text",
            emoji: true,
            text: "Almost Never",
          },
        },
        {
          type: "button",
          action_id: "survey-answer-2",
          value: `answer_${index}_2`,
          text: {
            type: "plain_text",
            emoji: true,
            text: "Sometimes",
          },
        },
        {
          type: "button",
          action_id: "survey-answer-3",
          value: `answer_${index}_3`,
          text: {
            type: "plain_text",
            emoji: true,
            text: "Almost Always",
          },
        },
        {
          type: "button",
          action_id: "survey-answer-4",
          value: `answer_${index}_4`,
          text: {
            type: "plain_text",
            emoji: true,
            text: "Always",
          },
        },
      ],
    },
  ];
}
