const { App } = require('@slack/bolt');
const Channel = require('./models/channel')

var mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.message("<@", ({ message, say }) => {
console.log(message);
  
  Channel.findOne({channelId:message.channel}).then(channel=>{
    var t=message.text.split("> ");
    if(t.length>1)
    {
      var user=t[0].substr(2,t[0].length);
      var action= t[1].trim();
    }

if(channel.user.findOne(user) )
{
   if(action[0]=='+')
   {
      say(`User <@${user}> Received ${action.length-1} Karma points`);

  
   }
   else{
      if(action[0]=='-')
      {
        say(`User <@${user}> Received minus ${action.length-1} Karma points`);
      }
    
   }

  }




  })
  
});

  
  app.message('hello',({message,say }) => {

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
  const channel = new Channel({
    channelId: message.channel,
    enabled: true
  });
  channel.save().then(() => say(`Bot enabled`));
  
});

app.message('disable', ({ message, say }) => {
  say(`Bot disabled, if you want to enable, type 'enable'`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();