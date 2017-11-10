const passport = require('passport');
const { passport: passportConfig} = require('../config/auth');

module.exports = passport.authenticate('jwt', passportConfig);
