const admin = require('firebase-admin');
const FirestoreODM = require('./FirestoreODM');
const serviceAccount = require('./serviceAccountKey.json');
const databaseURL = 'https://apartment-listings-demo.firebaseio.com';

const db = new FirestoreODM(admin);

db.connect(databaseURL, admin.credential.cert(serviceAccount));

module.exports = db;
