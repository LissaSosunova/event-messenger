const db = require('./db');

const avatar = db.Schema({
  id: {type: String},
  data: {Buffer, contentType: String},
  owner: {type: String},
  link: { type: String }
});

module.exports = db.model('Avatar', avatar);
