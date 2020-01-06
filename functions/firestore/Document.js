const hooks = require('./Hooks');
const validation = require('./Validation');
const Field = require('./Field');

const Document = class {
  constructor(data) {
    this._fields = {};
    if (data) {
      this._id = data.id;
      delete data.id;
    }
  }

  toObject() {
    const data = { id: this._id };

    for (const key in this._fields) {
      data[key] = this._fields[key].value;
    }
    return data;
  }

  toJSON() {
    return this.toObject();
  }

  setValue(fieldName, val, ignoreDirty) {
    this._fields[fieldName].setValue(val, ignoreDirty);
  }

  getValue(fieldName) {
    return this._fields[fieldName].getValue();
  }

  getDirty(fieldName) {
    return this._fields[fieldName].isDirty;
  }

  isNew() {
    return !this._id;
  }

  initFields(data) {
    const setAsInitialValue = !this.isNew();

    for (const key in this._fieldConfig) {
      this._fields[key] = new Field(this._fieldConfig[key]);

      // Set initial values
      if (data) {
        if (key in data) {
          this._fields[key].setValue(data[key], setAsInitialValue);
        }
      }
    }
    this.validateAll();
  }

  /**
   * Firestore data methods
   */
  static async find() {
    const documents = [];

    return this.db
      .collection(this.collection)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
      });
  }

  async isUnique(condition) {
    const property = Object.keys(condition)[0];
    const val = condition[property];

    return this._db
      .collection(this._collection)
      .where(property, '==', val)
      .limit(1)
      .get()
      .then(snapshot => {
        const doc = snapshot.docs[0];
        return doc ? false : true;
      });
  }

  static async findOne(conditions) {
    let collection = this.db.collection(this.collection);

    conditions.forEach(([property, operator, value]) => {
      collection = collection.where(property, operator, value);
    });

    return collection
      .limit(1)
      .get()
      .then(snapshot => {
        const doc = snapshot.docs[0];
        if (doc) {
          return new this.documentClass({ id: doc.id, ...doc.data() });
        }
      });
  }

  static async findById(id) {
    return this.db
      .collection(this.collection)
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          const item = new this.documentClass({ id: id, ...doc.data() });
          return item;
        } else {
          throw new Error('No such Document');
        }
      });
  }

  async save() {
    await this.runHooks('pre', 'save');

    const data = this.toObject();
    const id = this._id;

    this.validateAll();
    if (!this.isValid()) {
      throw new Error(JSON.stringify(this.getErrors()), 'ValidationError');
    }

    if (this.isNew()) {
      // create new record;
      return this._db
        .collection(this._collection)
        .add(data)
        .then(ref => {
          return { id: ref.id, ...data };
        });
    } else {
      // edit existing
      return this._db
        .collection(this._collection)
        .doc(id)
        .set(data)
        .then(ref => {
          return { id: ref.id, ...data };
        });
    }
  }

  async remove() {
    const id = this._id;

    return this._db
      .collection(this._collection)
      .doc(id)
      .delete()
      .then(() => {
        return true;
      });
  }
};

// Add hook functions
Document.pre = hooks.pre; //static
Document.prototype.runHooks = hooks.runHooks;

// Add validation functions
Document.prototype.validateAll = validation.validateAll;
Document.prototype.validate = validation.validate;
Document.prototype.isValid = validation.isValid;
Document.prototype.getErrors = validation.getErrors;

module.exports = Document;
