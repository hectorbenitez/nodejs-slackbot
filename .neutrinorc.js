// .neutrinorc.js
const react = require('@neutrinojs/react');

module.exports = {
  options: {
    root: __dirname + '/frontend'
  },
  use: [
    react()
  ]
};