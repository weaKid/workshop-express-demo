const express = require('express');
const passport = require('passport');
const accountRouter = require('./account/account.router');
const authStrategy = require('./account/auth.strategy');

const app = express();

passport.use(authStrategy);

app.use(express.json());
app.use(passport.initialize());
app.use(accountRouter);

app.listen(3000);

console.log('Server listening on http://localhost:3000');
