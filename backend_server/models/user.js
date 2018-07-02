var db = require('./db')
var user = db.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    name: { type: String },
    contacts: {type: Array},
    events: {type: Array},
    chats: {type: Array},
    avatar: { type: String}
});

module.exports = db.model('User', user);
