/**
 * Slack bot Commands
 */

module.exports = (app) => {
  require('./enable')(app)
  require('./disable')(app)
  require('./userMention')(app)
  require('./score')(app)
  require('./start')(app)
  require('./leaderboard')(app)
  require('./addQuestion')(app)
  require('./all')(app)
}