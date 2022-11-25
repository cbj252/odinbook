const passport = require("passport");
const bcrypt = require("bcrypt");
const async = require("async");
var path = require("path");

const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

const { timeString, userLiked } = require("./helperFunc");

exports.user_get = function (req, res, next) {
  User.findById(req.params.id).exec(function (err, userFound) {
    if (err) {
      return next(err);
    }
    if (userFound == null) {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    if (userFound._id.toString() == res.locals.currentUser._id.toString()) {
      return res.render("userSettings");
    }
    if (userFound.friends.includes(res.locals.currentUser._id)) {
      return Post.find({ user: userFound._id })
        .populate("user")
        .populate({
          path: "comments",
          populate: { path: "user" },
        })
        .exec(function (err, postsByUser) {
          postsByUser.forEach((post) => {
            post.timeString = timeString(post.date);
            post.userLiked = userLiked(post.likes, res.locals.currentUser._id);
            post.comments.forEach((comment) => {
              comment.timeString = timeString(comment.date);
              comment.userLiked = userLiked(
                comment.likes,
                res.locals.currentUser._id
              );
            });
          });
          res.render("userAlreadyFriend", {
            userFound: userFound,
            posts: postsByUser,
          });
        });
    }
    if (userFound.friend_given_req.includes(res.locals.currentUser._id)) {
      return res.render("userAcceptReq", { userFound: userFound });
    }
    res.render("userNoConnection", { userFound: userFound });
  });
};

exports.user_post = function (req, res, next) {
  User.findById(req.params.id).exec(function (err, newFriend) {
    if (err) {
      return next(err);
    }
    if (newFriend == null) {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    if (newFriend._id == res.locals.currentUser._id) {
      var err = new Error("You can't send a friend request to yourself!");
      err.status = 404;
      return next(err);
    }
    const friendIndex = newFriend.friends.indexOf(res.locals.currentUser._id);
    if (friendIndex != -1) {
      var err = new Error("You are already friends with this person!");
      err.status = 404;
      return next(err);
    }
    const friendReqMadeIndex = newFriend.friend_received_req.indexOf(
      res.locals.currentUser._id
    );
    if (friendReqMadeIndex != -1) {
      var err = new Error(
        "You have already sent a friend request to this person!"
      );
      err.status = 404;
      return next(err);
    }
    // No real reason why this is done instead of checking friend_received_req instead. They seem equivalent.
    const friendReqIndex = newFriend.friend_given_req.indexOf(
      res.locals.currentUser._id
    );
    if (friendReqIndex != -1) {
      res.redirect("/user/" + newFriend._id + "/accept");
    } else {
      res.locals.currentUser.friend_given_req.push(newFriend._id);
      newFriend.friend_received_req.push(res.locals.currentUser._id);

      async.parallel(
        {
          user: function firstUser(callback) {
            User.findByIdAndUpdate(res.locals.currentUser._id, {
              friend_given_req: res.locals.currentUser.friend_given_req,
            }).exec(callback);
          },
          otherUser: function otherUser(callback) {
            User.findByIdAndUpdate(newFriend._id, {
              friend_received_req: newFriend.friend_received_req,
            }).exec(callback);
          },
        },
        function (err) {
          if (err) {
            return next(err);
          }
          res.redirect("/main");
        }
      );
    }
  });
};

exports.friendAccept_post = function (req, res, next) {
  User.findById(req.params.id).exec(function (err, newFriend) {
    if (err) {
      return next(err);
    }
    if (newFriend == null) {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    // No real reason why this is done instead of checking friend_received_req instead. They seem equivalent.
    const friendReqIndex = newFriend.friend_given_req.indexOf(
      res.locals.currentUser._id
    );
    if (friendReqIndex == -1) {
      var err = new Error("This user has not sent you a friend request.");
      err.status = 404;
      return next(err);
    } else {
      newFriend.friend_given_req.splice(friendReqIndex, 1);
      const currentUserFriendIndex =
        res.locals.currentUser.friend_received_req.indexOf(req.params.id);
      res.locals.currentUser.friend_received_req.splice(
        currentUserFriendIndex,
        1
      );

      res.locals.currentUser.friends.push(newFriend._id);
      newFriend.friends.push(res.locals.currentUser._id);

      const newCurrentUser = {
        friend_received_req: res.locals.currentUser.friend_received_req,
        friends: res.locals.currentUser.friends,
      };
      const newOtherUser = {
        friend_given_req: newFriend.friend_given_req,
        friends: newFriend.friends,
      };
      async.parallel(
        {
          user: function firstUser(callback) {
            User.findByIdAndUpdate(
              res.locals.currentUser._id,
              newCurrentUser
            ).exec(callback);
          },
          otherUser: function otherUser(callback) {
            User.findByIdAndUpdate(newFriend._id, newOtherUser).exec(callback);
          },
        },
        function (err) {
          if (err) {
            return next(err);
          }
          res.redirect("/main");
        }
      );
    }
  });
};

exports.friendReject_post = function (req, res) {
  User.findById(req.params.id).exec(function (err, newFriend) {
    if (err) {
      return next(err);
    }
    if (newFriend == null) {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    // No real reason why this is done instead of checking friend_received_req instead. They seem equivalent.
    const friendReqIndex = newFriend.friend_given_req.indexOf(
      res.locals.currentUser._id
    );
    if (friendReqIndex == -1) {
      var err = new Error("This user has not sent you a friend request.");
      err.status = 404;
      return next(err);
    } else {
      newFriend.friend_given_req.splice(likesArrayIndex, 1);
      const currentUserFriendIndex =
        res.locals.currentUser.friend_received_req.indexOf(req.params.id);
      res.locals.currentUser.friend_received_req.splice(
        currentUserFriendIndex,
        1
      );

      async.parallel(
        {
          user: function firstUser(callback) {
            User.findByIdAndUpdate(res.locals.currentUser._id, {
              friend_received_req: res.locals.currentUser.friend_received_req,
            }).exec(callback);
          },
          otherUser: function otherUser(callback) {
            User.findByIdAndUpdate(newFriend._id, {
              friend_given_req: newFriend.friend_given_req,
            }).exec(callback);
          },
        },
        function (err) {
          if (err) {
            return next(err);
          }
          res.redirect("/main");
        }
      );
    }
  });
};

exports.profilePic = function (req, res, next) {
  const picUrl = req.body.profilePicUrl;
  if (!picUrl) {
    var err = new Error("Invalid Image");
    err.status = 400;
    return next(err);
  }
  const extension = path.extname(picUrl);
  const allowedExtensions = [".jpg", ".png", "jpeg"];
  if (!allowedExtensions.includes(extension)) {
    var err = new Error("Invalid Image");
    err.status = 400;
    return next(err);
  }
  User.findByIdAndUpdate(res.locals.currentUser._id, {
    profile_pic_url: picUrl,
  }).exec(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/main");
  });
};
