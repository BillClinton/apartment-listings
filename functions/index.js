const functions = require('firebase-functions');
const express = require('express');
var cors = require('cors');
const apartmentRouter = require('./routers/apartment');
const userRouter = require('./routers/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use(apartmentRouter);
app.use(userRouter);

app.get('/api/timestamp', (request, response) => {
  response.send(`${Date.now()}`);
});

// respond with 404 if root is requested
app.get('/api/', function(req, res) {
  res.send(404);
});

exports.app = functions.https.onRequest(app);
