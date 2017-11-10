const express = require('express');
const router = express.Router();

const accountValidator = require('./account.validator');
const accountController = require('./account.controller');
const authGuard = require('./auth.guard');

router.post('/account/signup', accountValidator.signUpRules, accountValidator.validate, accountController.signUp);
router.post('/account/login', accountValidator.loginRules, accountValidator.validate, accountController.login);
router.get('/account/refreshAuthToken', accountController.refreshAuthToken);
router.get('/account/isEmailRegistered', accountController.isEmailRegistered);
router.get('/account/profile', authGuard, accountController.getProfile);
router.post('/account/profile', authGuard, accountValidator.updateProfileRules, accountValidator.validate, accountController.updateProfile);
router.post('/account/updatePassword', authGuard, accountValidator.updatePasswordRules, accountValidator.validate, accountController.updatePassword);

module.exports = router;
