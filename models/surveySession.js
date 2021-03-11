const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SurveySessionSchema = new Schema(
  {
    slackUser: { type: String },
    userName: { type: String },
    userEmail: { type: String },
    survey: { type: Schema.Types.ObjectId, ref: "Survey" },
    index: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    questions: [
      {
        ts:{ type: String },
        question: { type: String },
        type: {type: String},
        context: {type: String},
        answer: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SurveySession",
  SurveySessionSchema,
  "surveySessions"
);
