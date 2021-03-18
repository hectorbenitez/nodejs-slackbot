const Survey = require("../models/survey");
const { startSurvey, saySurveyStartResults } = require("../services/surveyManager");
const { directMention } = require("@slack/bolt");

const startOptions = Object.freeze({
  TRIVIA: "trivia",
  SURVEY: "survey",
});

module.exports = (app) => {
  app.message(directMention(), "broadcast", async ({ message, say, client }) => {
    const command = message.text;
    const splitedCommand = command.replace(/\s/g,' ').split(" ");
    const startAction = splitedCommand[2];
    switch (startAction) {
      case startOptions.SURVEY:
        
        const slug = splitedCommand[3];
        const survey = await Survey.findOne({ slug });
        if(!survey){
          return await say("Survey not found");
        }
        
        let cursor, membersRequest;
        const msgPromises = [];
        do{
          membersRequest = await client.users.list({
            cursor 
          });
          cursor = membersRequest.response_metadata.next_cursor;
          for(let i=0; i<membersRequest.members.length;i++){
            const user = membersRequest.members[i];
            if(!user.is_bot && !user.is_app_user && user.name !== 'slackbot'){
              msgPromises.push(startSurvey({survey, user, slackClient: client}));
            }
          }
        }while(cursor && cursor.length)
        const result = await Promise.all(msgPromises);
        saySurveyStartResults({result, say});
        break;
      default:
        say("Command not found, try trivia or survey");
        break;
    }

  });
};
