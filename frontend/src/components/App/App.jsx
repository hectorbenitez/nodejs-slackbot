import React from 'react'
import SlackLogin from 'react-slack-login'

function App() {
    console.log(process.env, 'hola')
    const onSuccess = response => {
        console.log(response)
    }

    return <SlackLogin
    redirectUrl={process.env.SLACK_LOGIN_URI}
    onSuccess={onSuccess}
    slackClientId={process.env.SLACK_CLIENT_ID}
    slackUserScope='identity.basic'
  />
}

export default App