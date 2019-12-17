/**
 * Express router providing CRUD endpoints for apartment collection
 */
const express = require('express');
const router = new express.Router();

const Apartment = require('../models/Apartment');

router.get('/api/apartments', async (req, res) => {
  try {
    const apartments = await Apartment.find({});

    res.send(apartments);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.post('/api/apartments', async (req, res) => {
  console.log('POST');
  const apartment = new Apartment(req.body);

  try {
    const doc = await apartment.save();

    res.status(201).send({ doc });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

router.patch('/api/apartments/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name',
    'address',
    'rent',
    'bedrooms',
    'bathrooms',
    'contact',
    'available',
    'active'
  ];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates attempted.' });
  }

  try {
    const data = await Apartment.findById(req.params.id);
    const apartment = new Apartment(data);

    if (!apartment) {
      return res.status(404).send();
    }

    updates.forEach(update => apartment.set(update, req.body[update]));
    await apartment.save();
    res.send(apartment.obj());
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

router.delete('/api/apartments/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).send();
    }

    const result = apartment.remove();
    if (result === true) {
      return res.status(200).send();
    } else {
      res.status(400).send(result);
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
