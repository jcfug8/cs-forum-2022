const express = require("express");
const { update } = require("./model");
const server = express();

const { Thread, Post } = require("./model");

server.use(express.json({}));

server.use(express.static(`${__dirname}/public/`));

// this handler is what is used to get a single thread from the database
server.get("/thread/:id", (req, res) => {
  let result = {};
  res.setHeader("Content-Type", "application/json");
  console.log(`request to get a single thread with id ${req.params.id}`);
  Thread.findById(req.params.id)
    .then((thread) => {
      // thread - find by id
      console.log(`got thread:`, thread);
      result.thread = thread;
      return Post.find({
        thread_id: thread._id,
      });
    })
    .catch((err) => {
      // any error
      // TODO: handle reverting data on error better.
      // For now I'm not going to worry about it.
      res.status(500).send({
        message: `get request failed to get thread`,
        id: req.params.id,
        error: err,
      });
    })
    .then((posts) => {
      // post - find
      console.log(`got posts:`, posts);
      result.posts = posts;
      res.status(200).json(result);
    })
    .catch((err) => {
      // any error
      // TODO: handle reverting data on error better.
      // For now I'm not going to worry about it.
      res.status(500).send({
        message: `get request failed to get posts for thread`,
        id: req.params.id,
        error: err,
      });
    });
});

// this handler is what is used to get all threads
server.get("/thread", (req, res) => {
  console.log(`request to get a all threads`);
  Thread.find({}, function (err, threads) {
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
  Thread.findByIdAndDelete(req.params.id)
    .then((thread) => {
      result = thread;
      return Post.deleteMany({
        _id: {
          $in: thread.post_ids,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: `post request failed to delete thread`,
        id: req.params.id,
        error: err,
      });
    })
    .then((delRes) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: `post request failed to delete posts on thread`,
        id: req.params.id,
        error: err,
      });
    });
});

// this handler is what is used to insert a post
server.post("/post", (req, res) => {
  console.log(`request to insert a post: `, req.body);
  let post;
  res.setHeader("Content-Type", "application/json");
  // add the post to the db

  Thread.findById(req.params.id)
    .then((thread) => {
      return Post.create({
        author: req.body.author || "",
        body: req.body.body || "",
        thread_id: req.body.thread_id,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: `unknown thread`,
        id: req.params.id,
        error: err,
      });
    })
    .then((resPost) => {
      console.log("putting new post id into thread");
      post = resPost;
      return Thread.updateOne(
        { _id: req.params.thread_id },
        { $push: { post_ids: resPost._id } }
      );
    })
    .catch((err) => {
      res.status(500).send({
        message: `post request failed to create post`,
        error: err,
      });
    })
    .then((result) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      res.status(500).send({
        message: `unable to update thread with new post id`,
        error: err,
      });
    });
});

module.exports = server;
