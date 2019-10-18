const mongoose = require('mongoose')
const Schema = mongoose.Schema
const InstallSchema = new Schema(
  {
    teamId: { type: String },
    enterpriseId: { type: String },
    authData: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Install',
  InstallSchema
)
