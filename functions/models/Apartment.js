/**
 * Apartment model
 */
const Schema = require('validate');
const db = require('../db/db.js');

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  rent: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  contact: {
    type: String,
    trim: true
  },
  available: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = db.model('apartments', schema);
