const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SurveySessionSchema = new Schema(
  {
    slackUser: { type: String },
    survey: { type: Schema.Types.ObjectId, ref: "Survey" },
    index: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    questions: [
      {
        question: { type: String },
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
