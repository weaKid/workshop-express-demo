const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./user');
const { jwt: jwtConfig } = require('../config/auth');

module.exports = new JwtStrategy(jwtConfig, function (jwtPayload, done) {
  User.findOne({ _id: jwtPayload.sub }, function (err, user) {
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
