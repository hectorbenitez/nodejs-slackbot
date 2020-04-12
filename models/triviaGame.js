const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TriviaGameSchema = new Schema(
  {
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('TriviaGame', TriviaGameSchema, 'triviaGames')
