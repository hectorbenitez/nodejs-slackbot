
const seedData = require('./data/tbw2021SeedData');
const { WebClient } = require('@slack/web-api')
const mongoose = require('mongoose')
const TBWSettings = require('../models/tbwSetting');
const TBWGroups = require('../models/tbwGroup');

require('dotenv').config()

// Mongoose connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    // Get Settings
    let settings = await TBWSettings.findOne();

    if (!settings) {
      await seedData();
    }

    settings = await TBWSettings.findOne();

    var now = new Date();
    var startDate = new Date(settings.startDate);
    var endDate = new Date(settings.endDate);

    if (now < startDate || now > endDate) {
      console.log(`Process finished due to invalid date: ${startDate} - ${endDate} - Now: ${now}`);
      process.exit(0);
    }

    console.log('Process starting ... ');

    const slackClient = new WebClient();

    const groups = await TBWGroups.find();

    const promises = groups.map(async group => {
      for (var i = 0; i < group.users.length; i++) {
        try {
          let slackUserId;

          if (!group.users[i].slackUserId) {
            const slackUserData = await slackClient.users.lookupByEmail({
              email: group.users[i].email,
              token: process.env.SLACK_BOT_TOKEN
            })

            if (!slackUserData) {
              console.log(`User email: ${group.users[i].email} not found in Slack.`);
              continue;
            }

            // We update slack user id to avoid recovering it again next time
            await TBWGroups.updateOne(
              { 'users.email': group.users[i].email },
              {
                '$set': {
                  'users.$.slackUserId': slackUserData.user.id
                }
              }
            );
            
            slackUserId = slackUserData.user.id;
          } else {
            slackUserId = group.users[i].slackUserId;
          }

          // Send Slack Message
          await slackClient.chat.postMessage({
            channel: slackUserId,
            blocks: createMessage(settings, group),
            token: process.env.SLACK_BOT_TOKEN
          })
        } catch (err) {
          console.log(`Error working on user: ${group.users[i].email}`, err)
          console.log('error', err.data)
        }

      }
    });

    Promise.all(promises)
      .catch(error => console.log(error))
      .finally(() => {
        console.log('Process finished.');
        process.exit(0);
      });
  })

  function createMessage(settings, group) {
    const text = interpolate(settings.message, 
      {responsible: group.responsible, groupNumber: group.number, form: group.form, documentFolderLink: group.documentFolderLink});
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text
        },
      }
    ];
  }

  function interpolate(message, params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${message}\`;`)(...vals);
  }


