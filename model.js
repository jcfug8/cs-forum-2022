const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    author: String,
    body: String,
    thread_id: { type: Schema.Types.ObjectId, ref: "Thread" },
  },
  { timestamps: true }
);

const threadSchema = mongoose.Schema(
  {
    author: String,
    name: String,
    description: String,
    post_ids: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const Thread = mongoose.model("Thread", threadSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = {
  Thread,
  Post,
};
