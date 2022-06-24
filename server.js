const express = require("express");
const { update } = require("./model");
const cors = require("cors");
const server = express();

const { Thread, Post } = require("./model");

server.use(cors());

server.use(express.json({}));

server.use(express.static(`${__dirname}/public/`));

// this handler is what is used to get a single thread from the database
server.get("/thread/:id", (req, res) => {
  console.log(`request to get a single thread with id ${req.params.id}`);
  Thread.findById(req.params.id)
    .then((thread) => {
      if (thread === null) {
        res.status(404).json({
          message: `thread not found`,
        });
        return;
      }
      res.status(200).json(thread);
    })
    .catch((err) => {
      res.status(500).json({
        message: `get request failed to get thread`,
        error: err,
      });
    });
});

// this handler is what is used to get all threads
server.get("/thread", (req, res) => {
  console.log(`request to get a all threads`);
  Thread.find({}, "-posts")
    .then((threads) => {
      res.status(200).json(threads);
    })
    .catch((err) => {
      res.status(500).json({
        message: `get request failed to list all threads`,
        error: err,
      });
    });
});

// this handler is what is used to insert a thread
server.post("/thread", (req, res) => {
  console.log(`request to insert a thread: `, req.body);
  Thread.create({
    name: req.body.name || "",
    description: req.body.description || "",
    author: req.body.author || "",
    category: req.body.category || "",
  })
    .then((thread) => {
      res.status(201).json(thread);
    })
    .catch((err) => {
      res.status(500).json({
        message: `post request failed to create thread`,
        error: err,
      });
    });
});

// this handler is what is used to delete a single thread from the database
server.delete("/thread/:id", (req, res) => {
  let result;
  console.log(`request to delete a single thread with id ${req.params}`);
  Thread.findByIdAndDelete(req.params.id)
    .then((thread) => {
      if (thread === null) {
        res.status(404).json({
          message: `thread not found`,
          id: req.params.id,
        });
        return;
      }
      res.status(200).json(thread);
    })
    .catch((err) => {
      res.status(500).json({
        message: `post request failed to delete thread`,
        id: req.params.id,
        error: err,
      });
    });
});

// this handler is what is used to insert a post
server.post("/post", (req, res) => {
  console.log(`request to insert a post: `, req.body);
  let post;
  // add the post to the db

  Thread.findByIdAndUpdate(
    req.body.thread_id,
    {
      $push: { posts: new Post(req.body) },
    },
    {
      new: true,
    }
  )
    .then((thread) => {
      if (thread === null) {
        res.status(404).json({
          message: `thread not found`,
          id: req.params.thread_id,
        });
        return;
      }
      res.status(200).json(thread.posts[thread.posts.length - 1]);
    })
    .catch((err) => {
      res.status(500).json({
        message: `failed to insert post`,
        error: err,
      });
    });
});
// this handler is what is used to insert a post
server.delete("/thread/:thread_id/post/:post_id", (req, res) => {
  console.log(`request to delete a post:`, req.params.post_id);
  // add the post to the db
  Thread.findByIdAndUpdate(req.params.thread_id, {
    $pull: {
      posts: {
        _id: req.params.post_id,
      },
    },
  })
    .then((thread) => {
      if (thread === null) {
        res.status(404).json({
          message: `thread not found`,
          id: req.params.thread_id,
        });
        return;
      }
      let post;
      thread.posts.forEach((e) => {
        if (e._id == req.params.post_id) {
          post = e;
        }
      });

      if (post == undefined) {
        res.status(404).json({
          message: `thread not found`,
          id: req.params.id,
        });
        return;
      }

      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({
        message: `failed to delete thread`,
        error: err,
      });
    });
});

module.exports = server;
