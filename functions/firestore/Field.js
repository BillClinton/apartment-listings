function Field(field) {
  // set defaults
  this.type = String;
  this.value = '';
  this.isDirty = false;
  this.isValid = false;

  // set values received from config
  for (const key in field) {
    // change name of validation function to avoid conflict with this.validate()
    if (key === 'validate') {
      this.validateFn = field[key];
    } else {
      this[key] = field[key];
    }

    // set default value if sent
    if (key === 'default') {
      this.setValue(this[key]);
    }
  }
}

const setValue = function(value, setAsInitialValue) {
  let val = this.clean(value);
  if (val !== this.getValue()) {
    this.value = val;
    this.isDirty = setAsInitialValue === true ? false : true;
  }
};

const getValue = function() {
  return this.value;
};

const setValid = function(valid, error) {
  this.isValid = valid;
  this.error = valid ? null : error;
  return valid;
};

const clean = function(value) {
  value = this.trim ? value.trim() : value;
  value = this.lowercase ? value.toLowerCase() : value;
  return value;
};

Field.prototype.getValue = getValue;
Field.prototype.setValue = setValue;
Field.prototype.setValid = setValid;
Field.prototype.clean = clean;

module.exports = Field;
