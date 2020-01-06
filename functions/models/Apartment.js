/**
 * Apartment model
 */
const db = require('../firestore/db');

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
  },
  images: {
    type: Array,
    default: []
  }
};

const Apartment = db.model('apartments', fields);

module.exports = Apartment;
