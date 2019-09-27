const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.message('hello', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say(`Hey there <@${message.user}>!`);
});

app.message('help', ({ message, say }) => {
  console.log(process.env.BOTENABLED)
  if(process.env.BOTENABLED == 'true')
  {
    say(`enable - This command turn on the bot`);
    say(`disable - This command turn off the bot`);
    say(`help - Youre are here! :D`);
  }
});

app.message('enable', ({ message, say }) => {
  process.env.BOTENABLED=true;
  console.log(process.env.BOTENABLED)
  say(`Bot enabled`);
});

app.message('disable', ({ message, say }) => {
  process.env.BOTENABLED=false;
  console.log(process.env.BOTENABLED)
  say(`Bot disabled, if you want to enable, type 'enable'`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();