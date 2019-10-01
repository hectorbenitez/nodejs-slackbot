module.exports = app => {
  app.message('hello', ({ message, say }) => {
    say(`Hey there <@${message.user}>!`)
  })
}