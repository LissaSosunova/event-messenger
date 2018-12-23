const db = require('./db');

const messageItem = db.Schema({
    chatID: {type: String},
    authorId: {type: String},
    destination: {type: String},
    text: {type: String},
    edited: {type: Boolean},
    read: {type: Boolean},
    date: {type: String},
    time: {type: String}
});

const chat = db.Schema({
    users:{type: Array},
    email:{type: Array},
    messages: [messageItem],
    type: {type: String}
});

module.exports = db.model('Chat', chat);