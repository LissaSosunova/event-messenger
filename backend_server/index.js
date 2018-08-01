let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = 5006;
let $user = require('./user');
let $login = require('./login');
let $account = require('./account');
let $event = require('./event');
let $chat = require('./chat');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.route('/sendmes')
  .post($chat);
//
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

app.route('/login')
  .post($login);

app.route('/account')
  .get($account);

app.route('/chat/:id/')
   .get($chat);

app.route('/new_chat/')
  .post($chat);

app.route('/change_status/')
  .post($event);

app.listen(port);
console.log("Backend server listening on port " + port);

module.exports = { app };
