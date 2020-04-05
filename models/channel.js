const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ChannelSchema = new Schema(
  {
    channelId: { type: String },
    channelName: { type: String },
    teamId: { type: String },
    enabled: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Channel',
  ChannelSchema
)
