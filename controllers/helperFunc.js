const { body, validationResult } = require("express-validator");
const luxon = require('luxon');

const validPost = function(req, res, next) {
  body("content", "Content must not be empty.").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
}

const validComment = function(req, res, next) {
  body("content", "Content must not be empty.").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
}

const timeString = function(jstime) {
  const postDateTime = luxon.DateTime.fromJSDate(jstime);
  const duration = luxon.Interval.fromDateTimes(jstime, luxon.DateTime.now());
  const durationMinutes = duration.length("minutes");
  let durationValue;
  if (durationMinutes < 60) {
    durationValue = Math.round(durationMinutes);
    return `${durationValue} min ago`;
  }
  if (durationMinutes < (60 * 24)) {
    durationValue = Math.round(duration.length("hours"));
    if (durationValue == 1) {
      return "1 hour ago";
    }
    return `${durationValue} hours ago`;
  }
  if (durationMinutes < (60 * 24 * 30)) {
    durationValue = Math.round(duration.length("days"));
    if (durationValue == 1) {
      return "1 day ago";
    }
    return `${durationValue} days ago`;
  }
  durationValue = Math.round(duration.length("months"));
  if (durationValue == 1) {
    return "1 month ago";
  }
  return `${durationValue} months ago`;
}

const userLiked = function(givenContentLikes, currentUserId) {
  if (givenContentLikes.indexOf(currentUserId.toString()) != -1) {
    return true;
  }
  return false;
}

module.exports = { validPost, validComment, timeString, userLiked };