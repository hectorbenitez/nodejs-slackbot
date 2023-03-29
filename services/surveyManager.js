const SurveySession = require("../models/surveySession");
const { createBlockKitQuestion, createSurveyHeader } = require('./../services/blockKitBuilder');

module.exports =  {
  startSurvey: async({survey, user, slackClient}) => {
    let surveySession = await SurveySession.findOne({ slackUser: user.id, isCompleted: false });
    if (surveySession) {
      console.log("user has one started", user.id);
      return Promise.resolve({userId: user.id, result: "alreadyStarted"});
    }
    surveySession = new SurveySession();
    surveySession.slackUser = user.id;
    surveySession.userName = user.profile.real_name;
    surveySession.userEmail = user.profile.email;
    surveySession.survey = survey;
    surveySession.questions = survey.questions.map(({ question, type, options, context, condition, emoji, considerCompleted }) => ({
      question,
      type,
      options,
      context,
      emoji,
      condition,
      considerCompleted
    }));
    await surveySession.save();
    
    try{
      await slackClient.chat.postMessage({
        channel: user.id,
        blocks: createSurveyHeader(survey.surveyName, survey.welcomeMessage)
      });
      const result = await slackClient.chat.postMessage({
        channel: user.id,
        blocks: createBlockKitQuestion(surveySession, 0)
      })
      surveySession.questions[0].ts = result.ts;
      await surveySession.save();
    }catch(e){
      console.log(`error starting survey for user ${user.id}`, e);
      return Promise.resolve({userId: user.id, result: "error"});
    }
    console.log("user survey started", user.id);
    return Promise.resolve({userId: user.id, result: "started"})
  },
  saySurveyStartResults: async({result, say}) => {
    const {alreadyStarted, started, error} = result.reduce(
      (acc, current) => {
        acc[current.result].push(current.userId)
        return acc;
      },
      {alreadyStarted: [], started: [], error:[]}
    )

    console.log('results===', {alreadyStarted, started, error});

    if(started.length){
      await say(`Survey started for users: ${started.map(u => `<@${u}>`).join(' ')}`);
    }
    if(alreadyStarted.length){
      await say(`Survey not started (already one active) for users:  ${alreadyStarted.map(u => `<@${u}>`).join(' ')}`);
    }
    if(error.length){
      await say(`Error starting survey for users:  ${error.map(u => `<@${u}>`).join(' ')}`);
    }
  },
  saySurveyStartResult: async({result, say}) => {
    if(result === "alreadyStarted"){
      await say(`Survey not started (already one active)`);
    }
    if(result === "error"){
      await say(`Error starting survey`);
    }
  }
}