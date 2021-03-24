const webpack = require('webpack')
const neutrino = require('neutrino');

const config = neutrino().webpack();
config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'SLACK_LOGIN_URI', 'SLACK_CLIENT_ID']));

module.exports = config;