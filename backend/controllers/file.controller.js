const asyncHandler = require("express-async-handler");

const Note = require("../models/note.model.js");
const { s3 } = require("../middleware/file.middleware.js");
const { getSignedAwsS3Url } = require("../utils/s3.utils");

module.exports.uploadFile = asyncHandler(async (req, res) => {
  let file = {
    originalFileName: req.file.originalname,
    storedFileName: req.file.key,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: req.file.location,
    bucket: req.file.bucket,
  };
  const { id } = req.params;
  const note = await Note.findById(id).populate("tags", "name");
  // if(!note) covered by noteBelongsToUser middleware
  note.files.push(file);
  await note.save();
  delete note._doc.__v;
  if (note.files && note.files.length > 0) {
    for (file of note.files) {
      file.url = await getSignedAwsS3Url(file.bucket, file.storedFileName);
    }
  }
  res.json(note);
});

module.exports.deleteFile = asyncHandler(async (req, res) => {
  const { id, storedFileName } = req.params;
  await s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET || "track-my-notes-dev",
      Key: storedFileName,
    })
    .promise();
  const note = await Note.findByIdAndUpdate(
    id,
    { $pull: { files: { storedFileName } } },
    { new: true }
  )
    .populate("tags", "name")
    .select("-__v");
  res.json(note);
});
