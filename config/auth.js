const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = {
  jwt: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'e&9p87u-ri@vh6wj',
    expiresIn: '15m'
  },
  passport: {
    session: false
  },
  tokens: {
    refresh: {
      length: 128
    }
  }
};
