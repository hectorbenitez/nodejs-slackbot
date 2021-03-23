const neutrino = require('neutrino');
const Dotenv = require('dotenv-webpack');

const config = neutrino().webpack();
config.plugins.push(new Dotenv());

module.exports = config;