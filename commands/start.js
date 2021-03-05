const Channel = require("../models/channel");
const Question = require("../models/question");
const TriviaGame = require("../models/triviaGame");
const Survey = require("../models/survey");
const SurveySession = require("../models/surveySession");
const { createBlockKitQuestion } = require('./../services/blockKitBuilder');
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
    const splitedCommand = command.replace(/\s/g,' ').split(" ");
    const startAction = splitedCommand[2];
    switch (startAction) {
      case startOptions.SURVEY:
        
        const surveyName = splitedCommand[3];
        const survey = await Survey.findOne({ surveyName });
        if(!survey){
          return await say("Survey not found");
        }
        await say("Survey starting");
        
        let surveySession = await SurveySession.findOne({ slackUser: message.user, isCompleted: false });
        if (surveySession) {
          return await say('You are already answering a survey')
        }

        surveySession = new SurveySession();
        surveySession.slackUser = message.user;
        surveySession.survey = survey;
        surveySession.questions = survey.questions.map(({ question, type, context }) => ({
          question,
          type,
          context,
        }));
        surveySession.save();

        say({
          blocks: createBlockKitQuestion(surveySession.questions[0], 0)
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
