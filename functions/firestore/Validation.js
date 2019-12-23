const validateAll = function() {
  let valid = true;
  for (const key in this._fields) {
    // only update valid if validation fails
    valid = this.validate(key, this._fields[key]) ? valid : false;
  }
  return valid;
};

// return true/false if field is valid, set valid flag and error message.
const validate = function(fieldName, field) {
  let value = field.value;
  let valueString = `${value}`;

  // validate empty strings
  if (valueString.trim() === '') {
    if (field.required) {
      return field.setValid(false, `${fieldName} is required.`);
    } else {
      return field.setValid(true);
    }
  }

  // check maxlength
  if (field.maxlength) {
    if (valueString.length > field.maxlength) {
      return field.setValid(
        false,
        `${fieldName} can not contain more than ${field.maxlength} characters.`
      );
    }
  }

  // check minlength
  if (field.minlength) {
    if (valueString.length < field.minlength) {
      return field.setValid(
        false,
        `${fieldName} must be at least ${field.minlength} characters.`
      );
    }
  }

  // call custom validation function
  if (field.validateFn && typeof field.validateFn === 'function') {
    try {
      field.validateFn(value);
    } catch (e) {
      return field.setValid(false, e.message);
    }
  }

  return field.setValid(true);
};

const isValid = function() {
  for (const key in this._fields) {
    if (!this._fields[key].isValid === true) {
      return false;
    }
  }
  return true;
};

const getErrors = function() {
  const errors = {};
  for (const key in this._fields) {
    if (this._fields[key].error) {
      errors[key] = this._fields[key].error;
    }
  }
  return errors;
};

module.exports = {
  validateAll,
  validate,
  isValid,
  getErrors
};
