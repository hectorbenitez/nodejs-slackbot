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
    considerCompleted: {type: Boolean, default: false},
    questions: [
      {
        ts: { type: String },
        question: { type: String },
        type: { type: String },
        options: [{ type: String }],
        context: { type: String },
        answer: { type: String },
        condition: {
          idx: { type: Number },
          value: { type: String },
          values: [{ type: String }],
        },
        emoji: { type: String},
        considerCompleted: {type: Boolean, default: false},
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
