const Activity = require('../../../models/activity')
const User = require('../../../models/user')
const moment = require('moment')

module.exports = receiver => {
  receiver.get('/api/v1/teams/:team/score/:lapse', async (req, res) => {
    const today = moment().startOf('day')
    let fromDate;
    let toDate;
    switch(req.params.lapse) {
      case 'month':
        fromDate = moment(today).startOf('month')
        toDate = moment(today).endOf('month')
        break;
      case 'week':
        fromDate = moment(today).startOf('week')
        toDate = moment(today).endOf('week')
        break;
      case 'lastMonth':
        fromDate = moment(today).subtract(1, 'month').startOf('month')
        toDate = moment(today).subtract(1, 'month').endOf('month')
        break;
      case 'lastWeek':
        fromDate = moment(today).subtract(1, 'week').startOf('week')
        toDate = moment(today).subtract(1, 'week').endOf('week')
        break;
      default:
        break;
    }

    try {
      // https://docs.mongodb.com/manual/reference/operator/aggregation/group/
      const scores = await Activity.aggregate([
        {
          $match: {
            teamId: req.params.team,
            createdAt: {
              $gte: fromDate.toDate(),
              $lt: toDate.toDate()
            }
          }
        },
        {
          $group: {
            _id: '$userMentionedId',
            total: { $sum: '$beers' }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 5 },
      ])

      for(let i in scores) {
        const user = await User.findOne({ userId: scores[i]._id })
        scores[i].user = user
      }

      res.json(scores)
    } catch (error) {
      console.error('command score:', error)
      res.status(500).send('Internal Server Error')
    }
  })
}