const Survey = require("../models/survey");
const { startSurvey, saySurveyStartResults } = require("../services/surveyManager");
const { directMention } = require("@slack/bolt");


module.exports = (app) => {
  app.message(directMention(), "send-survey", async ({ message, say, client }) => {
    const command = message.text;
    const splitedCommand = command.replace(/\s/g,' ').split(/\s+/);

    const slug = splitedCommand[2];
    const survey = await Survey.findOne({ slug });
    console.log('splitedCommand', splitedCommand);
    console.log('survey', survey);

    if(!survey){
      return await say("Survey not found");
    }    

    const msgPromises = []
    for(let i=3; i<splitedCommand.length; i++){
      const userId = splitedCommand[i].replace(/<|>|@/g, '');
      const { user } = await client.users.info({
        user: userId
      });
      msgPromises.push(startSurvey({survey, user, slackClient: client}));
    }
    const result = await Promise.all(msgPromises);
    saySurveyStartResults({result, say});
  });
};
