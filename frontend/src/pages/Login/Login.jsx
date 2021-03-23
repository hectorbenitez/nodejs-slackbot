import React from "react";
import { useHistory } from "react-router-dom";
import SlackLogin from "react-slack-login";

function Login() {
  const history = useHistory();

  const onSuccess = (response) => {
    console.log(response);
    history.push("/dashboard");
  };

  return (
    <SlackLogin
      redirectUrl={process.env.SLACK_LOGIN_URI}
      onSuccess={onSuccess}
      slackClientId={process.env.SLACK_CLIENT_ID}
      slackUserScope="identity.basic"
    />
  );
}

export default Login;
