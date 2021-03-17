const Channel = require("../models/channel");
const Question = require("../models/question");
const TriviaGame = require("../models/triviaGame");
const Survey = require("../models/survey");
const { startSurvey, saySurveyStartResult } = require("../services/surveyManager");
const { directMention } = require("@slack/bolt");

const startOptions = Object.freeze({
  TRIVIA: "trivia",
  SURVEY: "survey",
});

module.exports = (app) => {
  app.message(directMention(), "start", async ({ message, say, client }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team,
    });

    const command = message.text;
    const splitedCommand = command.replace(/\s/g, " ").split(" ");
    const startAction = splitedCommand[2];
    switch (startAction) {
      case startOptions.SURVEY:
        const slug = splitedCommand[3];
        const survey = await Survey.findOne({ slug });
        if (!survey) {
          return await say(`Survey not found ${ slug }`);
        }

        const { user } = await client.users.info({
          user: message.user
        });
        const { result } = await startSurvey({survey, user, slackClient: client});
        saySurveyStartResult({result, say })
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
