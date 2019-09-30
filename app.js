const { App } = require('@slack/bolt');
const Channel = require('./models/channel')

var mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.message('hello', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say(`Hey there <@${message.user}>!`);
  Channel.find({
    channelId: 'TEST'
  }).then(channel => {
    console.log(channel)
  });
});

app.message('help', ({ message, say }) => {
    say(`enable - This command turn on the bot`);
    say(`disable - This command turn off the bot`);
    say(`help - Youre are here! :D`);
});

app.message('enable', ({ message, say }) => {
  console.log(message);
  Channel.findOneAndUpdate({channelId:message.channel}, {enabled:true}, {upsert: true})
  .then(() => {
    say(`Bot enabled`)
  })
  .catch(err => {
    console.log('error enabling',err);
    say(`Bot can't enable :(`)
  })
  
});

app.message('disable', ({ message, say }) => {
  Channel.findOneAndUpdate({channelId:message.channel}, {enabled:false}, {upsert: true})
  .then(() => {
    say(`Bot disabled, if you want to enable, type 'enable'`);
  })
  .catch(err => {
    console.log('error disabling',err);
    say(`Bot can't disable :(`)
  })
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();