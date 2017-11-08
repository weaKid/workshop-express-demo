const { check, validationResult } = require('express-validator/check');
const User = require('./user');

module.exports = {
  signUpRules: [
    check('firstName')
      .isLength({ min: 1 })
      .withMessage('Can not be empty'),
    
    check('lastName')
      .isLength({ min: 1 })
      .withMessage('Can not be empty'),
    
    check('email')
      .isEmail()
      .withMessage('Must be an email')
      .custom(email => {
        return User.findOne({ email: email })
          .then(user => {
            return user
              ? Promise.reject('This email already exists.')
              : Promise.resolve(true);
          });
      }),
    
    check('password', 'passwords must be at least 8 chars long and contain one number')
      .isLength({ min: 8 })
      .matches(/\d/)
  ],
  loginRules: [
    check('email')
      .isEmail()
      .withMessage('Must be an email'),
    
    check('password')
      .isLength({ min: 1 })
      .withMessage('Can not be empty')
  ],
  updateProfileRules: [
    check('firstName')
      .isLength({ min: 1 })
      .withMessage('Can not be empty'),
    
    check('lastName')
      .isLength({ min: 1 })
      .withMessage('Can not be empty'),
    
    check('email')
      .isEmail()
      .withMessage('Must be an email')
      .custom((email, { req }) => {
        return User.findOne({ email: email, _id: { $ne:  req.user._id} })
          .then(user => {
            return user
              ? Promise.reject('This email already exists.')
              : Promise.resolve(true);
          });
      })
  ],
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    
    next();
  }
};
