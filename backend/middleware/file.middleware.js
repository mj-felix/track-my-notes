const uuid = require('uuid');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET
});

// const fileFilter = (req, file, cb) => {
//     const isAllowableMimeType = file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";
//     if (isAllowableMimeType) {
//         cb(null, true);
//     } else {
//         cb(new ExpressError("Invalid mime type, only images and PDFs.", 415), false);
//     }
// };

const size20mb = 20 * 1024 * 1024;

const uploadS3 = multer({
    limits: { fileSize: size20mb },
    // fileFilter: fileFilter,
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET || 'track-my-notes-dev',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, uuid.v4() + '-' + file.originalname.replace(/[^\.a-zA-Z0-9_-]/g, ''));
        }
    })
}).single('file');

module.exports = { s3, uploadS3 };