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

  receiver.router.get('/', (req, res) => {
    res.send('ok')
  })

  // receiver.router.post('/', (req, res) => {
  //   console.log(req, receiver.router)
  //   res.send(req._body)
  // })
}
