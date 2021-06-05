const express = require("express");
const { update } = require("./model");
const server = express();

const { Thread, Post } = require("./model");

server.use(express.json({}));

server.use(express.static(`${__dirname}/public/`));

// this handler is what is used to get a single thread from the database
server.get("/thread/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`request to get a single thread with id ${req.params.id}`);
  Thread.findById(req.params.id, function (err, thread) {
    if (err) {
      res.status(500).send({
        message: `get request failed to get thread`,
        id: req.params.id,
        error: err,
      });
      return;
    } else if (thread === null) {
      res.status(404).send({
        message: `thread not found`,
        id: req.params.id,
      });
      return;
    }
    res.status(200).json(thread);
  });
});

// this handler is what is used to get all threads
server.get("/thread", (req, res) => {
  console.log(`request to get a all threads`);
  Thread.find({}, "-posts", function (err, threads) {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      res.status(500).send({
        message: `get request failed to list all threads`,
        error: err,
      });
      return;
    }
    res.status(200).json(threads);
  });
});

// this handler is what is used to insert a thread
server.post("/thread", (req, res) => {
  console.log(`request to insert a thread: `, req.body);
  Thread.create(
    {
      name: req.body.name || "",
      description: req.body.description || "",
      author: req.body.author || "",
    },
    function (err, thread) {
      res.setHeader("Content-Type", "application/json");
      if (err) {
        res.status(500).send({
          message: `post request failed to create thread`,
          error: err,
        });
        return;
      }
      res.status(201).json(thread);
    }
  );
});

// this handler is what is used to delete a single thread from the database
server.delete("/thread/:id", (req, res) => {
  let result;
  console.log(`request to delete a single thread with id ${req.params}`);
  Thread.findByIdAndDelete(req.params.id, function (err, thread) {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      res.status(500).send({
        message: `post request failed to delete thread`,
        id: req.params.id,
        error: err,
      });
      return;
    } else if (thread === null) {
      res.status(404).send({
        message: `thread not found`,
        id: req.params.id,
      });
      return;
    }
    res.status(200).json(thread);
  });
});

// this handler is what is used to insert a post
server.post("/post", (req, res) => {
  console.log(`request to insert a post: `, req.body);
  let post;
  res.setHeader("Content-Type", "application/json");
  // add the post to the db

  Thread.findByIdAndUpdate(
    req.body.thread_id,
    {
      $push: { posts: new Post(req.body) },
    },
    {
      returnOriginal: true,
    },
    function (err, thread) {
      if (err) {
        res.status(500).send({
          message: `failed to insert post`,
          error: err,
        });
        return;
      } else if (thread === null) {
        res.status(404).send({
          message: `thread not found`,
          id: req.params.thread_id,
        });
        return;
      }
      res.status(200).json(thread.posts[thread.posts.length - 1]);
    }
  );
});
// this handler is what is used to insert a post
server.delete("/post/:thread_id/:post_id", (req, res) => {
  console.log(`request to delete a post:`, req.params.post_id);
  let post;
  res.setHeader("Content-Type", "application/json");
  // add the post to the db

  Thread.findByIdAndUpdate(
    req.params.thread_id,
    {
      $pull: {
        posts: {
          _id: req.params.post_id,
        },
      },
    },
    function (err, thread) {
      if (err) {
        res.status(500).send({
          message: `failed to delete thread`,
          error: err,
        });
        return;
      } else if (thread === null) {
        res.status(404).send({
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
        res.status(404).send({
          message: `thread not found`,
          id: req.params.id,
        });
        return;
      }

      res.status(200).json(post);
    }
  );
});

module.exports = server;
