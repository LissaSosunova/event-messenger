const mongoose = require('mongoose');
const db_url = process.env.MONGODB_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:127.0.0.1:27017/eventmessenger-users';

mongoose.connect(db_url, { useNewUrlParser: true });

module.exports = mongoose;
