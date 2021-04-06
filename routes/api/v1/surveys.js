const SurveySession = require("./../../../models/surveySession");
const Survey = require("./../../../models/survey");
const { Parser } = require('json2csv');
const surveySessions = require("./surveySessions");

module.exports = (receiver) => {
  receiver.router.get("/api/v1/surveys", async (req, res) => {
    try {
      const surveys = await Survey.find();
      
      res.json(surveys);
    } catch (error) {
      console.error("get surveys error", error);
      res.status(500).send("Internal Server Error");
    }
  })

  receiver.router.get("/api/v1/surveys/:id/surveySessions", async (req, res) => {
    const {id} = req.params;
    const {format} = req.query;
    try {
      const survey = await Survey.findById(id);
      const sessions = await SurveySession.find({survey: id});

      const fields = ['userName', 'userEmail', ...survey.questions.map(q => q.question)];
      const data = sessions.map(s => {
        const data = {userName: s.userName, userEmail: s.userEmail}
        
        s.questions.forEach((q, i) => {
          data[survey.questions[i].question] = q.answer;
        })
        
        
        return data;
      });


      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment(`${survey.surveyName}.csv`);
      return res.send(csv);

      // res.json(sessions);
    } catch (error) {
      console.error("get sessions error", error);
      res.status(500).send("Internal Server Error");
    }
  });

};
