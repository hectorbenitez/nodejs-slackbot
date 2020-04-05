const Activity = require('../models/activity')
const { directMention } = require('@slack/bolt')

module.exports = app => {
  app.message(directMention(), 'score', async ({ message, say }) => {
    // console.log('message', message)

    const firstDate = new Date()
    firstDate.setDate(1)
    firstDate.setHours(0,0,0,0)
    const lastDate = new Date()
    lastDate.setDate(1)
    lastDate.setMonth(firstDate.getMonth() + 1)
    lastDate.setHours(0,0,0,0)

    try {
      // https://docs.mongodb.com/manual/reference/operator/aggregation/group/
      const activities = await Activity.aggregate([
        {
          $match: {
            createdAt: {
              $gte: firstDate,
              $lt: lastDate
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

      // console.log('activities', activities)
      const rows = activities.map((item, index) => {
        return `*${index+1}*\t\t<@${item._id}>\t\t${item.total} :beer:\n`
      })
      say(`Rank\t|\tPerson\t|\tTotal beers this month\n${rows.join('')}`)
    } catch (error) {
      console.error('command score:', error)
    }
  })
}
