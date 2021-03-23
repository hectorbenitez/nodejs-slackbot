const jwt = require('jsonwebtoken');
const Team = require("../models/team");

module.exports = (app, receiver) => {
  receiver.router.get("/oauth/login", async (req, res) => {
    // console.log('It works!!!', req.query.code)
    const code = req.query.code;
    app.client.oauth.v2
      .access({
        redirect_uri: process.env.SLACK_LOGIN_URI,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
      })
      .then(async (response) => {
        console.log("response", response);
        if (response.ok) {
          const token = jwt.sign(
            {
              iss: "encora-standbot",
              sub: response.authed_user.id,
            },
            process.env.JWT_SECRET
          );

          return res.json({
            token,
          });
        }
      })
      .catch((error) => console.log(error));

    res.sendStatus(200);
  });
};
