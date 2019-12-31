const jwt = require('jsonwebtoken');
const User = require('../models/user');
const webTokenPassphrase = require('./webTokenPassphrase.json');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, webTokenPassphrase.token);
    const user = await User.findById(decoded._id);

    if (user && user.getValue('tokens').includes(token)) {
      req.token = token;
      req.user = user;
    } else {
      throw new Error();
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;
