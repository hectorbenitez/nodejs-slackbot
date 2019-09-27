const { App } = require('@slack/bolt');
const Channel = require('./models/channel')

var mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const botId = 'UNWGTHC5C';
app.message('hello', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say(`Hey there <@${message.user}>!`);

  Channel.find({
    channelId: 'CNUBMHXUY'
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
  say(`Bot enabled`);
});

app.message('disable', ({ message, say }) => {
  say(`Bot disabled, if you want to enable, type 'enable'`);
});

app.message('top', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  if(message.text.indexOf(botId) == 2)
  {
    //say(`Hey there <@${message.user}>! there is a list with the top users`);
    Channel.findOne({
      channelId: message.channel
    }).then(channel => {
    
      var arrayUsers = channel.users

      var keys = [];
    for(var k in channel.users) keys.push(k);
      let len = keys.length;
      for (let i = 0; i < len; i++) {
        
          for (let j = 0; j < len; j++) {
              if (arrayUsers[keys[j]] < arrayUsers[ keys[j+ 1] ]) {
                  let tmp = arrayUsers[keys[j]];
                  arrayUsers[keys[j]] = arrayUsers[keys[j+ 1] ];
                  arrayUsers[keys[j+ 1] ] = tmp;
              }
          }
      }
      var messageToUser = ""
      for (let i = 0; i < len; i++) {
        messageToUser += `<@${keys[i]}>: ${arrayUsers[keys[i]]}\n`
      }
      say(`Hey there <@${message.user}>! there is a list with the top users\n` + messageToUser);
    });
  }
 
});

app.message('bottom', ({ message, say }) => {
  if(message.text.indexOf(botId) == 2)
  {
 // say() sends a message to the channel where the event was triggered
 Channel.findOne({
  channelId: message.channel
}).then(channel => {

  var arrayUsers = channel.users

  var keys = [];
for(var k in channel.users) keys.push(k);
  let len = keys.length;
  for (let i = 0; i < len; i++) {
    
      for (let j = 0; j < len; j++) {
          if (arrayUsers[keys[j]] > arrayUsers[ keys[j+ 1] ]) {
              let tmp = arrayUsers[keys[j]];
              console.log(tmp)
              arrayUsers[keys[j]] = arrayUsers[keys[j+ 1] ];
              arrayUsers[keys[j+ 1] ] = tmp;
          }

      }
  }
  var messageToUser = ""
  for (let i = 0; i < len; i++) {
    messageToUser += `<@${keys[i]}>: ${arrayUsers[keys[i]]}\n`
  }
  say(`Hey there <@${message.user}>! there is a list with the bottom users\n` + messageToUser);
});
  }

});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();