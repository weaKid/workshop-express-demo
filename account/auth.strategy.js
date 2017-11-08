const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./user');
const authConfig = require('../config/auth');

module.exports = new JwtStrategy(authConfig, function (jwtPayload, done) {
  User.findOne({_id: jwtPayload.sub}, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});
