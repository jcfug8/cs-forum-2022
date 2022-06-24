const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    author: String,
    body: String,
    thread_id: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  },
  { timestamps: true }
);

const threadSchema = mongoose.Schema(
  {
    author: String,
    name: String,
    description: String,
    posts: [postSchema],
    category: String,
  },
  { timestamps: true }
);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    required: true,
    unique: true,
  },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
});

const Thread = mongoose.model("Thread", threadSchema);
const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  Thread,
  Post,
  User,
};
