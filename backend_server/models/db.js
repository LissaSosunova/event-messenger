var mongoose = require('mongoose');
const db_url = process.env.MONGODB_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/eventmessenger-users';

mongoose.connect(db_url, { useNewUrlParser: true });

module.exports = mongoose;
