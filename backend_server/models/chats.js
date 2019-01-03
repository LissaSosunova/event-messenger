const db = require('./db');

const deletedInfo = db.Schema({
    any: {}
}, { strict: false });

const messageItem = db.Schema({
    chatID: {type: String},
    authorId: {type: String},
    destination: {type: String},
    text: {type: String},
    edited: {type: Boolean},
    read: {type: Boolean},
    date: {type: String},
    time: {type: String},
    isDeleted: deletedInfo
});

const chat = db.Schema({
    users:[String],
    email:[String],
    messages: [messageItem],
    type: {type: String}
});

module.exports = db.model('Chat', chat);