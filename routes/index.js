/**
 * Routes
 */

module.exports = (app) => {
  require('./installApp')(app)
  require('./api/v1/userTeams')(app)
  require('./api/v1/teamActivity')(app)
  require('./api/v1/teamScore')(app)
}