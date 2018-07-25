var db = require('./db');
var chat = db.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    messages: {type: Array}
});

module.exports = db.model('Chat', chat);