const SurveySession = require("./../../../models/surveySession");

module.exports = (receiver) => {
  receiver.router.get("/api/v1/surveySessions", async (req, res) => {
    try {
      let sessions = await SurveySession.find().populate("survey")
      sessions = sessions.filter(session => session.survey && session.survey.slug === 'wellbeing2023');
      res.json(sessions);
    } catch (error) {
      console.error("get sessions error", error);
      res.status(500).send("Internal Server Error");
    }
  });

  receiver.router.get("/api/v1/surveySessions/:id", async (req, res) => {
    try {
      const sessions = await SurveySession.findById(req.params.id).populate(
        "survey"
      );
      res.json(sessions);
    } catch (error) {
      console.error("get session error", error);
      res.status(500).send("Internal Server Error");
    }
  });

  receiver.router.delete("/api/v1/surveySessions/:id", async (req, res) => {
    try {
      const deleted = await SurveySession.deleteOne({_id: req.params.id});
      res.json(sessions);
    } catch (error) {
      console.error("command score:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
