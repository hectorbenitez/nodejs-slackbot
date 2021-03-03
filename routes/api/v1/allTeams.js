const Team = require('../../../models/team')

module.exports = receiver => {
  receiver.get('/api/v1/teams/all', async (req, res) => {
    try {
      const teams = await Team.find()
      res.json(teams)
    } catch (error) {
      console.error('command score:', error)
      res.status(500).send('Internal Server Error')
    }
  })
}