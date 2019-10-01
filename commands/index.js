module.exports = app => {
  require('./hello')(app)
  require('./karma')(app)
  require('./enable')(app)
  require('./disable')(app)
  require('./top')(app)
  require('./bottom')(app)
  require('./userMention')(app)
}