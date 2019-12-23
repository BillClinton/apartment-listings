const util = require('util');

const Document = class {
  constructor(data) {
    this._id = data.id;
    delete data.id;
  }

  static pre(methodName, fn) {
    if (!this.hooks.pre) {
      this.hooks.pre = {};
    }
    console.log('vcalling static pre function');
    this.hooks['pre'][methodName] = fn;
  }

  async runHooks(hookType, methodName) {
    const hooks = this.constructor.hooks;
    if (hooks[hookType] && hooks[hookType][methodName]) {
      const fn = hooks[hookType][methodName];
      console.log(typeof fn);
      console.log(fn.constructor.name);
      if (typeof fn === 'function') {
        console.log('its a function');
        if (fn.constructor.name === 'AsyncFunction') {
          console.log('its async - waiting');
          await fn.call(this);
        } else {
          console.log('its normal');
          fn.call(this);
        }
      }
    }
  }

  toObject() {
    const data = {};

    for (const key in this._fields) {
      data[key] = this._fields[key].value;
    }
    return data;
  }

  toJSON() {
    return { id: this._id, ...this.toObject() };
  }

  setValue(fieldName, val) {
    this._fields[fieldName].value = val;
    this._fields[fieldName].isDirty = true;
  }

  getValue(fieldName) {
    return this._fields[fieldName].value;
  }

  initFields(data) {
    for (const key in this._fields) {
      // Set base field properties
      this._fields[key] = Object.assign(
        {
          type: String,
          value: '',
          isDirty: false,
          isValid: false
        },
        this._fields[key]
      );

      // Set initial values
      if (key in data) {
        this._fields[key].value = data[key];
      }
    }
    this.validateAll();
  }

  isDirty(fieldName) {
    return this._fields[fieldName].isDirty;
  }

  validateAll() {
    for (const key in this._fields) {
      this.validate(key, this._fields[key]);
    }
  }

  validate(fieldName, field) {
    let valid = true;
    let value = field.value;
    let valueString = `${value}`;

    if (field.required && valueString.trim() === '') {
      valid = false;
      field.error = `${fieldName} is required.`;
    }

    field.isValid = valid;

    if (valid) {
      delete field.error;
    }
    return valid;
  }

  isValid() {
    let valid = true;
    for (const key in this._fields) {
      if (!this.validate(key, this._fields[key])) {
        valid = false;
      }
    }
    return valid;
  }

  getErrors() {
    const errors = {};
    for (const key in this._fields) {
      if (this._fields[key].error) {
        errors[key] = this._fields[key].error;
      }
    }
    return errors;
  }

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

  static async findById(id) {
    return this.db
      .collection(this.collection)
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          //return { id: id, ...doc.data() };
          const item = new this.documentClass.cls({ id: id, ...doc.data() });
          return item;
        } else {
          throw new Error('No such Document');
        }
      });
  }

  async save() {
    const data = this.toObject();
    const id = this._id;

    if (!this.isValid()) {
      throw new Error(JSON.stringify(this.getErrors()), 'ValidationError');
    }

    console.log('running hooks');
    await this.runHooks('pre', 'save');
    console.log('ran hooks');

    if (id) {
      // edit existing
      return this._db
        .collection(this._collection)
        .doc(id)
        .set(data)
        .then(() => {
          return true;
        });
    } else {
      // create new
      return data;
      // return this._db
      //   .collection(this._collection)
      //   .add(data)
      //   .then(function(ref) {
      //     return { id: ref.id, ...data };
      //   });
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

module.exports = Document;
