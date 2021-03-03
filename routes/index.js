/**
 * Routes
 */

module.exports = (receiver) => {
  require('./installApp')(receiver)
  require('./api/v1/userTeams')(receiver)
  require('./api/v1/allTeams')(receiver)
  require('./api/v1/teamActivity')(receiver)
  require('./api/v1/teamScore')(receiver)

  receiver.router.get('/', (req, res) => {
    res.send('ok')
  })
}
