const express = require("express");
const { update } = require("./model");
const server = express();

const { Thread, Post } = require("./model");

server.use(express.json({}));

server.use(express.static(`${__dirname}/public/`));

// this handler is what is used to get a single thread from the database
server.get("/thread/:id", (req, res) => {
  console.log(`request to get a single thread with id ${req.params}`);
  Thread.findById(req.params.id, function (err, thread) {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      res.status(500).send({
        message: `post request failed to get thread`,
        id: req.params.id,
        error: err,
      });
      return;
    }
    // TODO get posts
    res.status(200).json(thread);
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
  let deadline;
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
    }

    // remove posts that were attached to this thread
    Post.deleteMany(
      {
        _id: {
          $in: thread.post_ids,
        },
      },
      function (err, result) {
        if (err) {
          console.error(
            `unable to delete posts belonging to thread with id: ${req.params.id}`
          );
        }
        res.status(200).json(thread);
      }
    );
  });
});

// this handler is what is used to insert a post
server.post("/post", (req, res) => {
  console.log(`request to insert a post: `, req.body);

  // add the post to the db
  Post.create(
    {
      author: req.body.author || "",
      body: req.body.body || "",
      thread_id: req.body.thread_id,
    },
    function (err, post) {
      res.setHeader("Content-Type", "application/json");
      if (err) {
        res.status(500).send({
          message: `post request failed to create post`,
          error: err,
        });

        // record tha this post belongs to the thread
        Thread.updateOne(
          { _id: req.params.id },
          { $push: { post_ids: post._id } },
          function (err, result) {
            if (err) {
              console.error(
                `unable to delete posts belonging to thread with id: ${req.params.id}`
              );
            }
            res.status(201).json(post);
          }
        );
        return;
      }
    }
  );
});

module.exports = server;
