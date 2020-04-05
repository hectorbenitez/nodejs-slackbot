const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema(
  {
    userId: { type: String },
    userProfile: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'User',
  UserSchema
)
