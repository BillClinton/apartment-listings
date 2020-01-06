const Document = require('./Document');

const DocumentStore = function(firebaseAdmin) {
  this._admin = firebaseAdmin;

  this.connect = (credential, dbURL, bucketURL, bucketName) => {
    this._admin.initializeApp({ credential, dbURL, bucketURL });
    this._db = this._admin.firestore();
    this.storage = this._admin.storage();
    this.bucketName = bucketName;
  };

  this.storageBucket = this.model = (collection, fields) => {
    const db = this._db;

    /**
     * Create static db property on Document class if it doesn't already exist.
     * This will be shared by all subclasses and will be accessible in static methods.
     */
    if (!Document.db) {
      Document.db = db;
    }

    /**
     * Create _db property on Document prototype if it doesn't already exist.
     * This will be shared by all subclasses and will be accessible in class instances.
     */
    if (!Document.prototype._db) {
      Document.prototype._db = db;
    }

    // Extend Document to add vars specific to each instance
    const document = class extends Document {
      constructor(data) {
        super(data);

        this._db = db;
        this._collection = collection;
        this._fieldConfig = fields;

        this.initFields(data);
      }
    };

    /**
     * Create static collection property on Document subclass.
     * This will be accessible to static methods.
     */
    Object.defineProperty(document, 'collection', {
      value: collection,
      writable: false,
      enumerable: true,
      configurable: false
    });

    /**
     * Create static hooks property on Document subclass.
     * This will be accessible to static methods.
     */
    Object.defineProperty(document, 'hooks', {
      value: {},
      writable: false,
      enumerable: true,
      configurable: false
    });

    /**
     * Create static documentClass property on Document subclass
     * This will be accessible to static methods and allow static methods
     * to instantiate their own classes.
     */
    Object.defineProperty(document, 'documentClass', {
      //value: { cls: document },
      value: document,
      writable: false,
      enumerable: true,
      configurable: false
    });

    return document;
  };
};

module.exports = DocumentStore;
