const Channel = require('../models/channel')
const Question = require('../models/question')
const TriviaGame = require('../models/triviaGame')
const SurveySession = require('../models/surveySession')
const Survey = require('../models/survey')
const fetch = require('node-fetch');
// const noDirectMention = require('../middlewares/noDirectMention')

module.exports = app => {
  app.message(/.+/, async ({ message, say, context }) => {
    let channel = await Channel.findOne({
      channelId: message.channel,
      teamId: message.team
    })

    if (!channel) {
      return
    }

    const triviaGame = await TriviaGame.findOne({
      channel: channel._id
    }).populate('question')

    const surveySession = await SurveySession.findOne({
      channel: channel._id
    }).populate("survey")

    const survey = await Survey.findById({
      _id: surveySession.survey._id
    })

    let nextQuestion = null
    if (
      message.text.toLowerCase() === triviaGame.question.answer.toLowerCase()
    ) {
      nextQuestion = await Question.random()
      triviaGame.question = nextQuestion._id
      if (!triviaGame.leaderboard) {
        triviaGame.leaderboard = {}
      }
      if (!triviaGame.leaderboard[message.user]) {
        triviaGame.leaderboard[message.user] = 0
      }
      triviaGame.leaderboard[message.user]++
      triviaGame.markModified('leaderboard')
      await triviaGame.save()
      await app.client.reactions.add({
        token: context.botToken,
        channel: message.channel,
        name: 'thumbsup',
        timestamp: message.ts
      })
    }

    if (nextQuestion) {
      await say(
        `Nice going <@${message.user}>, you have ${
          triviaGame.leaderboard[message.user]
        } points.`
      )
      setTimeout(
        async () => await say(`Next question: ${nextQuestion.question}`),
        1000
      )
    }

    if (survey.questions[0].answers.includes(message.text)) {
      console.log(surveySession);
      
      const url = "http://localhost:3005/api/v1/surveyAnswers/saveAnswer"
      const data = {
        _idUserSurveyAnswers:survey.answerSurveyId,
        _idQuestion: survey.surveyQuestions[0],
        answer:message.text
      }
      console.log(data);
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }).then(async res => await res.json())
        .then(json => {
          survey.questions.shift()
          survey.surveyQuestions.shift()
          if (survey.questions.length > 0)
            say(`Q: ${survey.questions[0].question} A: |${survey.questions[0].answers} |`)
          else
            say("Gratz! Survey finished!!")
          survey.markModified("questions")
          survey.markModified("surveyQuestions")
          survey.save()
        });      
    }
  })
}
