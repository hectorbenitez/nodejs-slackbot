const neutrino = require('neutrino');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

const config = neutrino().webpack();
if(process.env.NODE_ENV === 'production') {
    config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'SLACK_LOGIN_URI', 'SLACK_CLIENT_ID']));
} else {
    config.plugins.push(new Dotenv());
}

module.exports = config;