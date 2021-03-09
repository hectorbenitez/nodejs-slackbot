const Channel = require("../models/channel");
const Question = require("../models/question");
const TriviaGame = require("../models/triviaGame");
const Survey = require("../models/survey");
const SurveySession = require("../models/surveySession");
const {
  createBlockKitQuestion,
  createSurveyHeader,
} = require("./../services/blockKitBuilder");
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
          return await say("Survey not found");
        }
        await say("Survey starting");

        let surveySession = await SurveySession.findOne({
          slackUser: message.user,
          isCompleted: false,
        });
        if (surveySession) {
          return await say("You are already answering a survey");
        }

        const { user: { profile: { real_name, email } } } = await client.users.info({
          user: message.user
        });
        surveySession = new SurveySession();
        surveySession.slackUser = message.user;
        surveySession.userName = real_name;
        surveySession.userEmail = email;
        surveySession.survey = survey;
        surveySession.questions = survey.questions.map(
          ({ question, type, context }) => ({
            question,
            type,
            context,
          })
        );
        surveySession.save();

        await say({
          blocks: createSurveyHeader(survey.surveyName, survey.welcomeMessage),
        });

        await say({
          blocks: createBlockKitQuestion(surveySession, 0),
        });
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
