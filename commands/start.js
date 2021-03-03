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
        const survey = await Survey.findOne({ surveyName })

        const surveySession = new SurveySession()
        surveySession.slackUser = message.user;
        surveySession.survey = survey;
        surveySession.questions = survey.questions.map(question => { question });
        surveySession.save();

        say(
          {
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Question: Question 1?"
                }
              },
              {
                "type": "actions",
                "elements": [
                  {
                    "type": "button",
                    "text": {
                      "type": "plain_text",
                      "emoji": true,
                      "text": "Approve"
                    },
                    "value": "click_me_123"
                  },
                  {
                    "type": "button",
                    "text": {
                      "type": "plain_text",
                      "emoji": true,
                      "text": "Deny"
                    },
                    "value": "click_me_123"
                  }
                ]
              }
            ]
          }
        );




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
