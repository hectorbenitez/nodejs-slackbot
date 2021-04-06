/**
 * Routes
 */

module.exports = (app, receiver) => {
  require('./installApp')(app, receiver)
  require('./loginWithSlack')(app, receiver)

  require('./api/v1/userTeams')(receiver)
  require('./api/v1/allTeams')(receiver)
  require('./api/v1/teamActivity')(receiver)
  require('./api/v1/teamScore')(receiver)

  require('./api/v1/surveySessions')(receiver)
  require('./api/v1/surveys')(receiver)
}
