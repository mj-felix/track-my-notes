const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const User = require("../models/user.model.js");
const Note = require("../models/note.model.js");
const errors = require("../messages/error.messages.js");
const { getSignedAwsS3Url } = require("../utils/s3.utils");

module.exports.getPublicUserProfile = asyncHandler(async (req, res) => {
  let user = await User.findOne({ profileName: req.params.profilename }).select(
    "-password -__v -refreshToken -isAdmin -createdAt -updatedAt"
  );
  if (user) {
    const userNotes = await Note.find({ user: user._id, isPublic: true });
    const publicNotesExist = !!userNotes.length;
    if (user.isPublic) {
      delete user._doc._id;
      user._doc.publicNotesExist = publicNotesExist;
    } else {
      user = {
        isPublic: false,
        profileName: user.profileName,
        publicNotesExist: publicNotesExist,
      };
    }
    res.json(user);
  } else {
    res.status(404);
    throw new Error(errors.user.NOT_FOUND);
  }
});

module.exports.getPublicNote = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error(errors.note.NOT_FOUND);
  }
  const note = await Note.findOne({ _id: req.params.id, isPublic: true })
    .select("-__v")
    .populate({
      path: "user",
      match: { profileName: req.params.profilename },
      select: "profileName isPublic -_id",
    })
    .populate("tags", "name", null, { sort: { name: "asc" } });
  if (note && note.user) {
    if (note.files && note.files.length > 0) {
      for (file of note.files) {
        file.url = await getSignedAwsS3Url(file.bucket, file.storedFileName);
      }
    }
    res.json(note);
  } else {
    res.status(404);
    throw new Error(errors.note.NOT_FOUND);
  }
});

module.exports.getPublicNotes = asyncHandler(async (req, res) => {
  let user = await User.findOne({ profileName: req.params.profilename });
  if (user) {
    const { tags } = req.query;
    const findFilter = { user: user._id, isPublic: true };
    if (tags) {
      // all search tags matching Note tags
      findFilter.tags = { $all: tags.split(",") };
    }
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    const notesCount = await Note.countDocuments(findFilter);
    const userNotes = await Note.find(findFilter)
      .select("-__v -files.url")
      .sort({ isSticky: "desc", madePublicAt: "desc", updatedAt: "desc" })
      .populate("tags", "name", null, { sort: { name: "asc" } })
      .populate("user", "isPublic profileName -_id")
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({
      notes: userNotes,
      notesCount,
      page,
      pageSize,
      pages: Math.ceil(notesCount / pageSize),
    });
  } else {
    res.status(404);
    throw new Error(errors.user.NOT_FOUND);
  }
});
