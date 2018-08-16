var db = require('./db');
var chat = db.Schema({
    users:{type: Array},
    email:{type: Array},
    messages: {type: Array}
});

module.exports = db.model('Chat', chat);