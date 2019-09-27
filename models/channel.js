const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ChannelSchema = new Schema(
  {
    channelId: { type: String },
    botUserId: { type: String },
    users: { type: Schema.Types.Mixed },
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
