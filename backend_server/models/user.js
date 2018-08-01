var db = require('./db');

var contact = db.Schema({
  id: { type: String },
  name: { type: String },
  avatar: { type: String },
  private_chat: { type: String },
  email: { type: String }
});
var eventNotification = db.Schema({
  id: { type: String },
  type: { type: String },
  message: { type: String }
});
var chat = db.Schema({
  id: { type: String },
  name: { type: String },
  avatar: { type: String }
});

var event = db.Schema({
  id: { type: String },
  name: { type: String },
  status: { type: Boolean },
  date: { type: Array },
  notification: { eventNotification }
});

var notification = db.Schema({
  id: { type: String },
  type: { type: String },
  message: { type: String },
  status: { type: Boolean}
});

var user = db.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    name: { type: String },
    contacts: [ contact ],
    events: [ event ],
    chats: [ chat ],
    avatar: { type: String},
    notifications: [ notification ]
});

module.exports = db.model('User', user);
