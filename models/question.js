const mongoose = require('mongoose')
const Schema = mongoose.Schema
const QuestionSchema = new Schema(
  {
    category: { type: String },
    question: { type: String },
    answer: { type: String },
  },
  {
    timestamps: true
  }
)

QuestionSchema.statics.random = async () => {
  const count = await QuestionModel.countDocuments()
  const rand = Math.floor(Math.random() * count)
  return QuestionModel.findOne().skip(rand)
};

const QuestionModel = mongoose.model('Question', QuestionSchema)
module.exports = QuestionModel
