const fs = require('fs');
const util = require('util');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const htmlToText = require('html-to-text');
const emailConfig = require('./config/email');

const readFile = util.promisify(fs.readFile);
let transporter = nodemailer.createTransport(emailConfig.transporter);

module.exports = {
  send
};

async function send(message) {
  if (message.template && message.context) {
    const content = await readFile(message.template, 'utf-8');
    const template = handlebars.compile(content);
    const html = template(message.context);
    const text = htmlToText.fromString(html);
    message.html = html;
    message.text = text;
  }
  
  message.from = message.from || emailConfig.from;
  
  return transporter.sendMail(message);
}
