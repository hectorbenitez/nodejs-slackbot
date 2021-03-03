const Activity = require('../../../models/activity')

module.exports = receiver => {
  receiver.router.get('/api/v1/teams/:team/activity', async (req, res) => {
    try {
      const activity = await Activity.find({ teamId: req.params.team })
                                      .populate('channel')
                                      .populate('user')
                                      .populate('userMentioned')
                                      .sort({ createdAt: -1 })
                                      .limit(30)
      res.json(activity)
    } catch (error) {
      console.error('command score:', error)
      res.status(500).send('Internal Server Error')
    }
  })
}