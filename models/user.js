var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  display_name: { type: String, required: true },
  profile_pic_url: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friend_given_req: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friend_received_req: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Virtual for book's URL
UserSchema.virtual("url").get(function () {
  return "/user/" + this._id;
});

//Export model
module.exports = mongoose.model("User", UserSchema);