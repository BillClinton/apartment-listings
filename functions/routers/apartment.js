/**
 * Express router providing CRUD endpoints for apartment collection
 */
const express = require('express');
const router = new express.Router();
const fileUpload = require('../middleware/fileUpload');
const errorFormat = require('./errorFormat');
const Apartment = require('../models/Apartment');

router.get('/api/apartments', async (req, res) => {
  try {
    const apartments = await Apartment.find({});
    res.send(apartments);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.get('/api/apartments/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).send();
    }
    res.send(apartment);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post('/api/apartments', async (req, res) => {
  const apartment = new Apartment(req.body);

  try {
    const errors = await apartment.save();
    if (Array.isArray(errors) && errors.length > 0) {
      return res.status(400).send(errorFormat(errors));
    }
    return res.status(201).send(apartment.obj());
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
    const apartment = await Apartment.findById(req.params.id);

    //updates.forEach(update => apartment.setValue(update, req.body[update]));
    updates.forEach(update => {
      apartment.setValue(update, req.body[update]);
    });
    await apartment.save();
    res.status(200).send(apartment);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.delete('/api/apartments/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).send();
    }

    const result = await apartment.remove();
    if (result === true) {
      return res.status(200).send();
    } else {
      res.status(400).send(result);
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post('/api/apartments/:id/upload', fileUpload, async (req, res) => {
  const apartment = await Apartment.findById(req.params.id);

  if (!apartment) {
    return res.status(404).send();
  }

  const files = [];

  req.files.forEach(file => {
    delete file.fieldname;
    delete file.buffer;
    files.push(file);
  });

  apartment.setValue('images', apartment.getValue('images').concat(files));
  apartment.save();
  res.status(200).send(apartment);
});

module.exports = router;
