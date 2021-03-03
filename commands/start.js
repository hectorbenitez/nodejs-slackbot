const Channel = require("../models/channel");
const Question = require("../models/question");
const TriviaGame = require("../models/triviaGame");
const Survey = require("../models/survey");
const SurveySession = require("../models/surveySession");
const fetch = require("node-fetch");
const { directMention } = require("@slack/bolt");

const startOptions = Object.freeze({
  TRIVIA: "trivia",
  SURVEY: "survey",
});

module.exports = (app) => {
  app.message(directMention(), "start", async ({ message, say }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team,
    });

    const command = message.text;
    const splitedCommand = command.split(" ");
    const startAction = splitedCommand[2];
    switch (startAction) {
      case startOptions.SURVEY:
        say("Survey starting");

        const surveyName = splitedCommand[3];
        const survey = await Survey.findOne({ surveyName });

        let surveySession = await SurveySession.findOne({ slackUser: message.user, isCompleted: false });
        if (surveySession) {
          return await say('You are already answering a survey')
        }

        surveySession = new SurveySession();
        surveySession.slackUser = message.user;
        surveySession.survey = survey;
        surveySession.questions = survey.questions.map(({ question }) => ({
          question,
        }));
        surveySession.save();

        say({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Question: ${surveySession.questions[0].question}`,
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

        // const url = `${process.env.API_BASE_URL}/api/v1/surveyAnswers`;
        // const data = {
        //   userId: message.user,
        //   surveyName: surveyName,
        // };
        // console.log(data, url);
        // const surveySession = await SurveySession.findOne({
        //   channel: channel._id,
        // });
        // fetch(url, {
        //   method: "POST",
        //   body: JSON.stringify(data),
        //   headers: { "Content-Type": "application/json" },
        // })
        //   .then(async (res) => await res.json())
        //   .then((json) => {
        //     const survey = new Survey({
        //       surveyName: json.survey.surveyName,
        //       questions: json.survey.questions,
        //       answerSurveyId: json._id,
        //       surveyQuestions: json.questions,
        //     });
        //     survey.save();
        //     surveySession.survey = survey;
        //     surveySession.save();
        //     say(
        //       ` Q: ${survey.questions[0].question} A: |${survey.questions[0].answers} |`
        //     );
        //   })
        //   .catch((error) => console.error(error));

        break;

      case startOptions.TRIVIA:
        const question = await Question.random();
        const triviaGame = await TriviaGame.findOne({
          channel: channel._id,
        });
        triviaGame.question = question._id;
        triviaGame.save();
        say(question.question);
        break;

      default:
        say("Command not found, try trivia or survey");
        break;
    }
  });
};
