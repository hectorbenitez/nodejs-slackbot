const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const Survey = require('../models/survey')
const SurveySession = require('../models/surveySession')
const fetch = require('node-fetch');
const { directMention } = require('@slack/bolt')

const startOptions = Object.freeze({
  TRIVIA: "trivia",
  SURVEY: "survey"
})

module.exports = app => {
  app.message(directMention(), 'start', async ({ message, say }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team
    })    

    const command = message.text.match(/start [\w]+$/)[0]
    const splitedCommand = command.split(" ")
    const startAction = splitedCommand[1]
    
    switch(startAction){

      case startOptions.SURVEY:
        say("Survey starting")
        const url = "http://localhost:3005/api/v1/surveyAnswers"
        const data = {
          _idUser: "602e9a7b8aea9d0815546fd9",
          _idSurvey: "602ae89e21697a369af0fdc6"
        }

        const surveySession = await SurveySession.findOne({
          channel: channel._id
        })
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        }).then(async res => await res.json())
          .then(json => { 
                          const survey = new Survey({
                            surveyName:json.survey.surveyName,
                            questions:json.survey.questions
                          })
                          survey.save()
                          surveySession.survey = survey
                          surveySession.save()
                          say(` Q: ${survey.questions[0].question} A: |${survey.questions[0].answers} |`)
                        });
        
        //const survey = splitedCommand[2]
        break

      case startOptions.TRIVIA:
        const question = await Question.random()
        const triviaGame = await TriviaGame.findOne({
          channel: channel._id
        })
        triviaGame.question = question._id
        triviaGame.save()
        say(question.question)
        break

      default:
        say("Command not found, try trivia or survey")
        break
    }    
  })
}
