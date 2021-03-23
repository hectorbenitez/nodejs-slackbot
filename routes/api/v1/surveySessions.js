const SurveySession = require('./../../../models/surveySession')

module.exports = receiver => {
    receiver.router.get('/api/v1/surveySessions', async (req, res) => {
      try {
        const sessions = await SurveySession.find()
        res.json(sessions)
      } catch (error) {
        console.error('command score:', error)
        res.status(500).send('Internal Server Error')
      }
    })

    receiver.router.get('/api/v1/surveySessions/:id', async (req, res) => {
      try {
        const sessions = await SurveySession.findById(req.params.id)        
        res.json(sessions)
      } catch (error) {
        console.error('command score:', error)
        res.status(500).send('Internal Server Error')
      }
    })
  }