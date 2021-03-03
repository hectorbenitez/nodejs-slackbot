const Team = require('../../../models/team')

module.exports = receiver => {
  receiver.get('/api/v1/users/:user/teams', async (req, res) => {
    try {
      const teams = await Team.find({ authedUserId: req.params.user })
      res.json(teams)
    } catch (error) {
      console.error('command score:', error)
      res.status(500).send('Internal Server Error')
    }
  })
}