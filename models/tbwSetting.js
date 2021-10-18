const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TBWSettingSchema = new Schema(
  {
    startDate: { type: Date },
    endDate: { type: Date },
    message: { type: String },
    responsibleMessage: {type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'TBWSetting',
  TBWSettingSchema
)
