const admin = require('firebase-admin');
const DocumentStore = require('./DocumentStore');
const serviceAccount = require('./serviceAccountKey.json');
const databaseURL = 'https://apartment-listings-demo.firebaseio.com';

const db = new DocumentStore(admin);

db.connect(databaseURL, admin.credential.cert(serviceAccount));

module.exports = db;
