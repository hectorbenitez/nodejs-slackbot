const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SurveySchema = new Schema(
    {
        surveyName: { type: String },
        slug: { type: String },
        welcomeMessage: { type: String },
        questions: [
            {   
                question: { type: String },
                type: {type: String},
                context: {type: String},
                answers: [{ type: String }],
            },
        ],
        answerSurveyId: { type:String },
        surveyQuestions: [{type: String}]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Survey", SurveySchema);
