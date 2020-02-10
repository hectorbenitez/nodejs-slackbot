const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ActivitySchema = new Schema(
  {
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
    teamId: { type: String },
    userId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userMentionedId: { type: String },
    userMentioned: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    beers: { type: Number }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Activity',
  ActivitySchema
)
