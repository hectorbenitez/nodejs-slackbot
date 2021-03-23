import React from 'react'
import SlackLogin from 'react-slack-login'

function App() {
    console.log(process.env)
    const onSuccess = () => {}

    return <SlackLogin
    redirectUrl='https://butler-hector.ngrok.io/oauth/login'
    onSuccess={onSuccess}
    slackClientId={process.env.REACT_APP_SLACK_CLIENT_ID}
    slackUserScope='identity.basic'
  />
}

export default App