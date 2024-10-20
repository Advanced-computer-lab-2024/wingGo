const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

// AWS S3 configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  })
});

module.exports = upload;