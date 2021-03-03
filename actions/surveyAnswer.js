const Channel = require('../models/channel')
const Question = require('../models/question')
const SurveySession = require('../models/surveySession')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.action(/survey-answer-(\d)/, async ({ ack, body, action, context, say }) => {
    console.log(body, action, context)
    await ack();
    
    const surveySession = await SurveySession.findOne({ slackUser: body.user.id, isCompleted: false });
    if (!surveySession) {
      return say('You are not answering a survey');
    }

    console.log(body.user.id, surveySession);
    surveySession.questions[surveySession.index].answer = action.value;
    surveySession.index++;

    if(index === surveySession.questions.length) {
      surveySession.isCompleted = true;
    }

    await surveySession.save();

    if (surveySession.isCompleted) {
      return await say('Thanks!');
    }

    const question = surveySession.questions[surveySession.index];

    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Question: ${question.question}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              action_id: 'survey-answer-0',
              value: `answer_${surveySession.index}_0`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Never",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-1',
              value: `answer_${surveySession.index}_1`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Almost Never",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-2',
              value: `answer_${surveySession.index}_2`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Sometimes",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-3',
              value: `answer_${surveySession.index}_3`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Almost Always",
              }
            },
            {
              type: "button",
              action_id: 'survey-answer-4',
              value: `answer_${surveySession.index}_4`,
              text: {
                type: "plain_text",
                emoji: true,
                text: "Always",
              }
            },
          ],
        },
      ],
    });
  })
}



// My workplace allows me to work on my activities in a safe and hygenic way
// My job is very physically demanding
// I am worried I might suffer a workplace injury
// I consider that health and safety regulations are enforced in my workplace
// I consider that the activities I perform at work are dangerous
// Due to my workload, I have to work afterhours
// Due to my workload, I have to work nonstop
// In order to fulfill my tasks, I consider I must work at a fast pace
// My work demands my full concentration
// My job demands memorization of a lot of information
// I must make difficult on the spot decisions at work
// My job demands I work on different tasks at the same time
// I am responsible for high-value items at work
// I am accountable for the results of my whole work area
// I am given contradictory orders
// I am asked to perform unnecessary tasks
// I work overtime more than three times a week
// I am asked to work on holidays and weekends
// I think the time I spend at work affects my family activities and personal activities
// I must deal with work matters at home
// I constantly think about family or personal activities when I'm at work
// I think my family responsibilities affect my work
// My job allows me to develop new skills
// I can strive for a higher position at work
// I can take breaks when needed during my workday
// I decide how much I work during my workday
// I decide how fast I work
// I can change the order of the tasks I am given
// Constant changes make my job harder
// My ideas and contributions are considered whenever there are changes in my job
// I am clearly informed about my duties
// The expected results from my work are clearly explained to me
// The objectives of my work are clearly explained to me
// I am duly informed of who can help me solving problems or work-related issues
// I am allowed to attend trainings related to my work
// I receive useful trainings
// My leader helps me organize my work better
// My leader considers my opinions
// My leader tells me information related to my job in a timely manner
// My leader coaches me to improve my performance
// My leader helps me solve my work-related issues
// I can trust my coworkers
// My coworkers and I solve work-related issues in a respectful manner
// My job makes me feel part of the group
// Whenever we have to work in teams, my teammates are cooperative
// My coworkers help me when I face difficulties 
// When I do a good job, I am informed
// The way my work is evaluated helps me improve my performance
// I am paid my salary on time
// I am paid for the time I work
// If I achieve the expected results at work, I am rewarded or acknowledged 
// People who do a good job can aspire to career growth
// I think my job is stable
// My job has a high turnover rate
// I am proud of my job
// I feel commited to my job
// I can express my opinions freely at work
// I constantly receive criticism towards my person and/or my work
// I am constantly teased, slandered, defamed, put down, or ridiculed
// I am ignored or excluded from meetings and decision making. 
// Work situations are manipulated to make me look bad
// My work accomplishments are attributed to other people
// I am denied opportunities of career growth
// I have witnessed workplace violence
// I must provide customer or user service at my work
// I deal with angry customers/users
// My job requires me to attend to people in need or sick
// I must display emotions different to the ones I am experiencing
// My job requires me to deal with violent situations
// I am the leader of other workers
// My workers communicate their issues in an untimely manner 
// My workers hinder work results
// My workers are uncooperative
// My workers ignore my feedback