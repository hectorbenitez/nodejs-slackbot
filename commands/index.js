/**
 * Slack bot Commands
 */

module.exports = (app) => {
  require('./enable')(app)
  require('./disable')(app)
  require('./userMention')(app)
  require('./score')(app)
}