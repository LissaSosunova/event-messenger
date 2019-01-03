const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5006;
const $user = require('./user');
const $login = require('./login');
const $account = require('./account');
const $event = require('./event');
const $chat = require('./chat');
const webSocketServer = require('./websockets');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.route('/profile')
  .post($user);
//
app.route('/event/:id/')
  .get($event);

app.route('/new_event')
  .post($event);

app.route('/user')
  .post($user);

app.route('/user')
  .get($user);

app.route('/finduser')
  .post($user);

app.route('/adduser')
  .post($user);

app.route('/deleteContact')
  .post($user);  

app.route('/deleteChat')
  .post($chat);
  
app.route('/login')
  .post($login);

app.route('/account')
  .get($account);

app.route('/change_status/')
  .post($event);
app.route('/chat')
   .get($chat);

app.listen(port);
console.log("Backend server listening on port " + port);

webSocketServer();

module.exports = { app };