const admin = require('firebase-admin');
const DocumentStore = require('./DocumentStore');
const serviceAccount = require('./serviceAccountKey.json');
const {
  databaseURL,
  storageBucketURL,
  storageBucketName
} = require('./dbConfig');

// const databaseURL = 'https://apartment-listings-demo.firebaseio.com';
// const storageBucket = 'https://apartment-listings-demo.firebaseio.com';

const db = new DocumentStore(admin);

db.connect(
  admin.credential.cert(serviceAccount),
  databaseURL,
  storageBucketURL,
  storageBucketName
);

module.exports = db;
