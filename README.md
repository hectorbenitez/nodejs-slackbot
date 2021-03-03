# nodejs-slackbot

# Prerequisites
Install
1. Mongodb
2. npm
3. Nodejs
4. ngrok

## 1. First steps
1.1 Clone the project by executing in a terminal
```
$ git clone https://github.com/hectorbenitez/nodejs-slackbot.git
```
1.2 Enter the directory of the project
```
$ cd nodejs-slackbot
```
1.3 Run `npm install` to install dependencies

## 2. Create a Slack App
3.1 Enter to the url https://api.slack.com

3.2 Click `Your apps`

3.3 Click `Create New App`

3.4 Give a name and select your workspace

**Note:** If you don't have a Slack Workspace you will have to create one.

## 3. Create a `.env` file
3.1 Inside the root directory of the project create a file called `.env`

3.2 Paste the following into the file:
```
SLACK_SIGNING_SECRET=
SLACK_BOT_TOKEN=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
MONGODB_URI=
```
3.3 For now we only need the `MONGODGB_URI`. For this step you can [setup your mongodb locally](https://docs.mongodb.com/manual/installation/) or you can use a [cloud service like Mongodb Atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_mexico_search_core_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624326&gclid=CjwKCAiAmrOBBhA0EiwArn3mfH1DsLw3fL4sFGTu5xIrtLQRHQK76B61kcQ14LGYi7narNo60pfIPRoCUokQAvD_BwE).

You can find more information about the `URI` you need [here](https://docs.mongodb.com/manual/reference/connection-string/)

3.4 In https://api.slack.com to the section `Your Apps` >> Select your app >> `Settings` >> `Basic Information`

3.5 Get your Client ID, Client Secret, Signing Secret and paste them in your `.env` file

3.6 Save your file.



## 4. Run ngrok
4.1 If you don't have ngrok installed, you can download it [here](https://ngrok.com/download)

4.2 In a terminal go to the dir where you have `ngrok`

4.3 Run:
```
$ ./ngrok http 3000
```

4.4 Copy the https URL in your clipboard. You'll need it for the next step.

## 5. Configure your Slack App
5.1 Make sure you have a URL similar to this one prepared `https://30213558f3da.ngrok.io`, from step `4.4`.

5.2 Go to the section `OAuth & Permissions`

5.3 Scroll down to `Redirect URLs` and click `Add new Redirect URL`

5.4 Paste the url and at the end write `/oauth/redirect`. You will end up with something like this
```
https://30213558f3da.ngrok.io/oauth/redirect
```

5.5 Click `Add` >> `Save URLs`

5.6 Now Scroll down to `Scopes` in the section `Bot Token Scopes` and make sure you have the following enabled:
- app_mentions:read
- calls:write
- channels:history
- chat:write
- chat:write:public
- groups:history
- im:history
- im:read
- team:read
- users:read
- reactions:write

5.7 Go to the Section `Event Suscriptions` and Enable Events

5.8 Remember the URL we copied? Copy it in the field `Request URL` and add `/slack/events` at the end.

You will end up with something like this:
```
https://30213558f3da.ngrok.io/slack/events
```
5.9 In the same section, click `Suscribe to bot events` and add the following:
- app_mention
- message.channels
- message.groups
- message.im

Save changes

5.10 Go to `Interactivity & Shortcuts` and turn Interactivity On

5.11 Paste the same URL you pasted in step `5.8`.

5.12 Save Changes

5.13 Navigate to the section `Install App` and install it, there you will get your `SLACK_BOT_TOKEN`. Make sure to include that in your `env` file

## 6. Final steps
6.1 Run our bot using
```
$ npm run dev
```

6.2 Head to https://api.slack.com/apps and navigate to your app.

6.3 In the sidebar there is a section called `Manage Distributions`. Click the button `Add to Slack` and then click `Allow`

If everything went all right you should see in your terminal an output like this one
```
response {
  ok: true,
  app_id: 'A01NMV0KH36',
  authed_user: { id: 'U01MRSWMDUH' },
  scope: 'app_mentions:read,calls:write,channels:history,chat:write,chat:write.public,groups:history,im:history,im:read,team:read,users:read,reactions:write',
  token_type: 'bot',
  access_token: 'xoxb-1733452868772-1788731738976-u6024nXfErzV96VxCDz5C4m7',
  bot_user_id: 'U01P6MHMQUQ',
  team: { id: 'T01MKDARJNQ', name: 'Interns Labs' },
  enterprise: null,
  is_enterprise_install: false,
  response_metadata: {}
}
Bot registered successfully
```
And in your ngrok terminal you should receive a `200 OK`

## 7. First commands
Now that you have your bot up and running you can try out the following commands:
```
@<name_of_your_bot> enable trivia
```
```
@<name_of_your_bot> start
```
```
@<name_of_your_bot> add-question ||encora||cuantos años tiene Hector?||38
```
