var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  image_url: { type: String },
});

//Export model
module.exports = mongoose.model("Post", PostSchema);