const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TeamSchema = new Schema(
  {
    appId: { type: String },
    teamId: { type: String },
    teamName: { type: String },
    enterpriseId: { type: String },
    authedUserId: { type: String },
    accessToken: { type: String },
    botId: { type: String },
    botUserId: { type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Team',
  TeamSchema
)
