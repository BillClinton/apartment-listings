/**
 * User model
 */
const db = require('../firestore/db.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const webTokenPassphrase = require('../middleware/webTokenPassphrase.json');

const fields = {
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate(val) {
      if (validator.contains(val.toUpperCase(), 'password'.toUpperCase())) {
        throw new Error('Password cannot contain the word "password"');
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email must be a valid email address');
      }
    }
  },
  tokens: {
    type: Array
  }
};

const User = db.model('users', fields);

/**
 * Generates an authentication token.
 * @returns {String} token The jsonwebtoken
 */
User.prototype.generateAuthToken = async function() {
  const user = this;
  const tokens = user.getValue('tokens') || [];
  const token = jwt.sign(
    { _id: user._id.toString() },
    webTokenPassphrase.token
  );

  user.setValue('tokens', tokens.concat(token));

  await user.save();

  return token;
};

/**
 * Deletes sensitive data from user before converting to JSON.
 * @returns {Object} user The user JSON object
 */
User.prototype.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

/**
 * Find a user based on email and password.
 * @param {string} email The user's email address
 * @param {string} password The user's password
 * @returns {Object} user The user JSON object
 */
User.findByCredentials = async (email, password) => {
  const conditions = [];
  conditions.push(['email', '==', email]);
  const user = await User.findOne(conditions);

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.getValue('password'));

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

//Hash plain text password before saving
User.pre('save', async function() {
  const user = this;

  if (user.getDirty('email')) {
    const isUnique = await user.isUnique({ email: this.getValue('email') });
    if (!isUnique) {
      throw new Error('Email address already in use');
    }
  }

  if (user.getDirty('password')) {
    user.setValue('password', await bcrypt.hash(user.getValue('password'), 8));
  }
});

module.exports = User;
