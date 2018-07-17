let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = 5006;
let $user = require('./user');
let $login = require('./login');
let $account = require('./account');
let $event = require('./event');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});


//
// app.route('/event/:id/')
//   .get($data.getEventById);
//
// app.route('/chat/:id/')
//   .get($data.getChatById);

// app.route('/sendmes')
//   .post($data.postMessege);
//
// app.route('/profile')
//   .post($data.postUserProfile);
//
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

app.listen(port);
console.log("Backend server listening on port " + port);

module.exports = { app };
