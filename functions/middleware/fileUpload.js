const multer = require('multer');
const db = require('../firestore/db.js');

const {
  storageBucketName,
  storagePublicURL
} = require('../firestore/dbConfig');

const SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

const multipartFormDataParser = multer({
  storage: multer.memoryStorage(),
  // increase size limit if needed
  limits: { fieldSize: SIZE_LIMIT },
  // support firebase cloud functions
  // the multipart form-data request object is pre-processed by the cloud functions
  // currently the `multer` library doesn't natively support this behaviour
  // as such, a custom fork is maintained to enable this by adding `startProcessing`
  // https://github.com/emadalam/multer
  startProcessing(req, busboy) {
    req.rawBody ? busboy.end(req.rawBody) : req.pipe(busboy);
  }
});

const cloudFileUpload = function(req, res, next) {
  if (!req.files) {
    return next();
  }

  const bucket = db.storage.bucket(storageBucketName);

  req.files.forEach(file => {
    const cloudName = `${file.originalname}-${Date.now()}`;
    const cloudFile = bucket.file(cloudName);

    const stream = cloudFile.createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    });

    stream.on('error', err => {
      file.cloudStorageError = err;
      next(err);
    });

    stream.on('finish', () => {
      file.cloudStorageBucket = storageBucketName;
      file.cloudStorageObject = cloudName;
      file.publicURL = storagePublicURL + storageBucketName + '/' + cloudName;
      cloudFile
        .makePublic()
        .then(() => {
          next();
        })
        .catch(e => {
          console.log(e);
          next();
        });
    });

    stream.end(file.buffer);
  });
};

module.exports = [multipartFormDataParser.any(), cloudFileUpload];
