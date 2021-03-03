const Channel = require('../models/channel')
const Question = require('../models/question')
const SurveySession = require('../models/surveySession')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.action(/survey-answer-(\d)/, async ({ ack, body, action, context, say }) => {
    console.log(body, action, context)
    await ack();
    
    const surveySession = await SurveySession.findOne({ slackUser: body.user.id });
    console.log(body.user.id, surveySession);
    surveySession.questions[surveySession.index].answer = action.value;
    surveySession.index++;
    await surveySession.save();

    const question = surveySession.questions[surveySession.index];

    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Question: ${question}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              action_id: 'survey-answer-0',
              value: `answer_${surveySession.index}_0`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Never",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-1',
              value: `answer_${surveySession.index}_1`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Almost Never",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-2',
              value: `answer_${surveySession.index}_2`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Sometimes",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-3',
              value: `answer_${surveySession.index}_3`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Almost Always",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-4',
              value: `answer_${surveySession.index}_4`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Always",
              }
            },
          ],
        },
      ],
    });
  })
}
