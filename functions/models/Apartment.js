/**
 * Apartment model
 */
const db = require('../firestore/db.js');

const fields = {
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
};

const Apartment = db.model('apartments', fields);

module.exports = Apartment;
