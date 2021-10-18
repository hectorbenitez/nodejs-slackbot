
const seedData = require('./data/tbw2021SeedData');
const { WebClient } = require('@slack/web-api')
const mongoose = require('mongoose')
const TBWSettings = require('../models/tbwSetting');
const TBWGroups = require('../models/tbwGroup');
const Team = require('../models/team')

require('dotenv').config()

const slackClient = new WebClient();

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

    const groups = await TBWGroups.find().populate('team')

    const promises = groups.map(async group => {
      // Send message to responsible
      let responsibleUserSlackId;

      if (!group.slackUserId) {
        const resposibleSlackUserData = await getSlackUserData(group.email, group.team.accessToken);

        if (!resposibleSlackUserData) {
          console.log(`Responsible email: ${group.email} not found in Slack.`);
        } else {

          // We update slack user id to avoid recovering it again next time
          await updateResponsible(group.email, resposibleSlackUserData.user.id);

          responsibleUserSlackId = resposibleSlackUserData.user.id;
        }
      } else {
        responsibleUserSlackId = group.slackUserId;
      }

      try {
      // Send Slack Message
      await slackClient.chat.postMessage({
        channel: responsibleUserSlackId,
        blocks: createResponsibleMessage(settings, group),
        token: group.team.accessToken
      })
    } catch (errResponsibleMessage) {
      console.log(`Unable to send message to responsible. Reason: ${errResponsibleMessage}`)
    }


      // Send message to all group users
      for (var i = 0; i < group.users.length; i++) {
        try {
          let slackUserId;

          if (!group.users[i].slackUserId) {
            const slackUserData = await getSlackUserData(group.users[i].email, group.team.accessToken);

            if (!slackUserData) {
              console.log(`User email: ${group.users[i].email} not found in Slack.`);
              continue;
            }

            // We update slack user id to avoid recovering it again next time
            await updateUserGroup(group.users[i].email, slackUserData.user.id);

            slackUserId = slackUserData.user.id;
          } else {
            slackUserId = group.users[i].slackUserId;
          }

          // Send Slack Message
          await slackClient.chat.postMessage({
            channel: slackUserId,
            blocks: createUserMessage(settings, group, group.users[i]),
            token: group.team.accessToken
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

async function getSlackUserData(email, token) {
  try {
    const slackUserData = await slackClient.users.lookupByEmail({
      email,
      token
    })

    return slackUserData;
  } catch (err) {
    console.log(`Error getting Slack user data for: ${email}. Error: ${err}`);
    return null;
  }
}

async function updateUserGroup(email, slackUserId) {
  await TBWGroups.updateOne(
    { 'users.email': email },
    {
      '$set': {
        'users.$.slackUserId': slackUserId
      }
    }
  );
}

async function updateResponsible(email, slackUserId) {
  await TBWGroups.updateOne(
    { 'email': email },
    {
      '$set': {
        'slackUserId': slackUserId
      }
    }
  );
}

function createUserMessage(settings, group, user) {
  const text = interpolate(settings.message,
    {
      responsible: group.responsible,
      groupNumber: group.number,
      form: group.form, documentFolderLink:
        group.documentFolderLink,
      userName: user.name,
    });
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

function createResponsibleMessage(settings, group) {
  const text = interpolate(settings.responsibleMessage,
    {
      responsible: group.responsible,
      form: group.form, 
      documentFolderLink: group.documentFolderLink
    });
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


