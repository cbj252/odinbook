const passport = require("passport");
const bcrypt = require("bcrypt");
const async = require("async");

const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

const {
  validPost,
  validComment,
  timeString,
  userLiked,
} = require("./helperFunc");

exports.index = function (req, res, next) {
  async.parallel(
    {
      friendPosts: function (callback) {
        Post.find({
          $or: [
            { user: res.locals.currentUser._id },
            { user: { $in: res.locals.currentUser.friends } },
          ],
        })
          .sort({ date: "desc" })
          .populate("user")
          .populate({
            path: "comments",
            populate: { path: "user" },
          })
          .exec(callback);
      },
      allFriends: function (callback) {
        User.find({ friends: { $in: res.locals.currentUser._id } }).exec(
          callback
        );
      },
      otherUsers: function (callback) {
        User.find({
          $and: [
            { friends: { $nin: res.locals.currentUser._id } },
            { friend_given_req: { $nin: res.locals.currentUser._id } },
            { _id: { $ne: res.locals.currentUser._id } },
          ],
        }).exec(callback);
      },
      friendReqs: function (callback) {
        User.findById(res.locals.currentUser._id)
          .populate("friend_received_req")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      results.friendPosts.forEach((post) => {
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
      res.render("homePage", {
        posts: results.friendPosts,
        friendReqs: results.friendReqs.friend_received_req,
        friendList: results.allFriends,
        otherUsers: results.otherUsers,
      });
    }
  );
};

exports.userSettings = function (req, res, next) {
  res.render("userSettings");
};

exports.makePost_post = function (req, res, next) {
  validPost();
  let newPost = new Post({
    user: res.locals.currentUser._id,
    date: new Date(),
    content: req.body.content,
  });
  newPost.save(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/main");
  });
};

exports.likePost_post = function (req, res, next) {
  Post.findById(req.params.id, "likes").exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      var err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }
    const likesArrayIndex = result.likes.indexOf(res.locals.currentUser._id);
    if (likesArrayIndex != -1) {
      result.likes.splice(likesArrayIndex, 1);
    }
    if (likesArrayIndex == -1) {
      const newLikes = result.likes.push(res.locals.currentUser._id);
    }
    Post.findByIdAndUpdate(
      req.params.id,
      { likes: result.likes },
      function callback(err) {
        if (err) {
          return next(err);
        }
        res.redirect("/main");
      }
    );
  });
};

exports.commentPost_post = function (req, res, next) {
  Post.findById(req.params.id, "comments").exec(function (err, postCommented) {
    validComment();
    let newComment = new Comment({
      user: res.locals.currentUser,
      date: new Date(),
      content: req.body.content,
    });
    newComment.save(function (err, newComment) {
      if (err) {
        return next(err);
      }
      let initialComments = postCommented.comments;
      initialComments.push(newComment);
      Post.findByIdAndUpdate(
        req.params.id,
        { comments: initialComments },
        function (err) {
          if (err) {
            return next(err);
          }
          res.redirect("/main");
        }
      );
    });
  });
};

exports.likeComment_post = function (req, res, next) {
  Comment.findById(req.params.id, "likes").exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      var err = new Error("Comment not found");
      err.status = 404;
      return next(err);
    }
    const likesArrayIndex = result.likes.indexOf(res.locals.currentUser._id);
    if (likesArrayIndex != -1) {
      result.likes.splice(likesArrayIndex, 1);
    }
    if (likesArrayIndex == -1) {
      result.likes.push(res.locals.currentUser._id);
    }
    Comment.findByIdAndUpdate(
      req.params.id,
      { likes: result.likes },
      function callback(err) {
        if (err) {
          return next(err);
        }
        res.redirect("/main");
      }
    );
  });
};
