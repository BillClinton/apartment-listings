/**
 * Simple object data modeling (ODM) library for working with Firstore
 */
const FirestoreModel = require('./FirestoreModel');

class FirestoreODM {
  constructor(admin) {
    this._admin = admin;
  }

  connect(databaseURL, credential) {
    this._admin.initializeApp({ credential, databaseURL });
    this._db = this._admin.firestore();
  }

  model(modelName, schema) {
    const db = this._db;

    const modelClass = FirestoreModel;

    Object.defineProperty(modelClass, 'db', {
      value: db,
      writable: false,
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(modelClass, 'collection', {
      value: modelName,
      writable: false,
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(modelClass, 'schema', {
      value: schema,
      writable: false,
      enumerable: true,
      configurable: false
    });

    const model = class extends modelClass {
      constructor(data) {
        super(data);

        console.log(data);

        this._schema = schema;
        this._collection = modelName;
        this._db = db;
      }
    };

    model.database = db;

    return model;
  }
}

module.exports = FirestoreODM;
