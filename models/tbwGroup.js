const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TBWGroupSchema = new Schema(
  {
    name: { type: String },
    responsible: { type: String },
    number: { type: Number },
    form: { type: String },
    documentFolderLink: { type: String },
    users: [{
      name: { type: String },
      email: { type: String },
      slackUserId: {type: String }
    }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'TBWGroup',
  TBWGroupSchema
)
