const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const Email = require('../email');
const User = require('./user');
const { bcrypt: { salts } } = require('../config/account');
const { jwt: { secretOrKey, expiresIn }, tokens: { refresh: { length: refreshTokenLength } } } = require('../config/auth');

module.exports = {
  signUp,
  login,
  sendPasswordResetEmail,
  refreshAuthToken,
  isEmailRegistered,
  getProfile,
  updateProfile,
  updatePassword
};

async function signUp(req, res) {
  const userData = req.body;
  const passwordHash = await bcrypt.hash(userData.password, salts);
  const refreshToken = randomstring.generate(refreshTokenLength);
  
  const user = await User.create({
    ...userData,
    refreshToken,
    password: passwordHash
  });
  
  res.json(user);
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(401).json({ error: 'Invalid email address.' });
    return;
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    res.status(401).json({ error: 'Invalid password.' });
    return;
  }
  
  const jwtToken = jwt.sign({ sub: user._id }, secretOrKey, { expiresIn });
  
  res.set('AccessToken', jwtToken);
  res.set('RefreshToken', user.refreshToken);
  res.json(user);
}

async function sendPasswordResetEmail(req, res) {
  await Email.send({
    to: 'john@doe.com',
    subject: 'Please reset your password',
    template: path.resolve(__dirname, 'password-reset-email.hbs'),
    context: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com'
    }
  });
  
  res.json();
}

async function refreshAuthToken(req, res) {
  const refreshToken = req.headers['refresh-token'];
  const user = await User.findOne({ refreshToken });
  
  if (!user) {
    res.status(401).json({ message: 'Invalid refresh token.' });
    return;
  }
  
  const jwtToken = jwt.sign({ sub: user._id }, secretOrKey, { expiresIn });
  
  res.set('AccessToken', jwtToken);
  res.json();
}

async function isEmailRegistered(req, res) {
  const user = await User.findOne({ email: req.query.email });
  if (user) {
    res.status(422).json({ message: 'This email is already registered.' });
  } else {
    res.json();
  }
}

function getProfile(req, res) {
  res.json(req.user);
}

async function updateProfile(req, res) {
  const { firstName, lastName, email } = req.body;
  
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      firstName,
      lastName,
      email
    }
  });
  
  res.json(user);
}

async function updatePassword(req, res) {
  const passwordHash = await bcrypt.hash(req.body.newPassword, salts);
  await User.update({ _id: req.user._id }, {
    password: passwordHash
  });
  
  res.json({ message: 'The password was updated.' });
}
