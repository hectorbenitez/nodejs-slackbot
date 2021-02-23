const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SurveySessionSchema = new Schema(
    {
        channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
        survey: { type: Schema.Types.ObjectId, ref: 'Survey' },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('SurveySession', SurveySessionSchema, 'surveySessions')
