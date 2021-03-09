const Channel = require("../models/channel");
const Survey = require("../models/survey");
const SurveySession = require("../models/surveySession");
const { createBlockKitQuestion } = require('./../services/blockKitBuilder');
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
        
        const surveyName = splitedCommand[3];
        const survey = await Survey.findOne({ surveyName });
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
    
          let member;
          for(let i=0; i<membersRequest.members.length;i++){
            member = membersRequest.members[i];
            if(!member.is_bot && !member.is_app_user && member.name !== 'slackbot'){
              let surveySession = await SurveySession.findOne({ slackUser: member.id, isCompleted: false });
              if (surveySession) {
                console.log("member has one started", member.id)
                return;
              }
              surveySession = new SurveySession();
              surveySession.slackUser = member.id;
              surveySession.survey = survey;
              surveySession.questions = survey.questions.map(({ question, type, context }) => ({
                question,
                type,
                context,
              }));
              surveySession.save();
  
              msgPromises.push(client.chat.postMessage({
                channel: member.id,
                blocks: createBlockKitQuestion(surveySession, 0)
              }));
            }
          }
        }while(cursor && cursor.length)
        say("Survey starting for all");
        await Promise.all(msgPromises);
        break;

      default:
        say("Command not found, try trivia or survey");
        break;
    }





    
    
  });
};
