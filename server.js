// init app
const express = require("express");
const app = express();

// pull in cors
const cors = require("cors");
// CORS! everyone loves it
app.use(cors());
// set up json parser
app.use(express.json({}));

// pull in session stuff
const sessionSetUp = require("./session");
sessionSetUp(app);

// pull in auth stuff
const authSetUp = require("./auth");
authSetUp(app);

const { Thread, Post, User } = require("./model");

// set up basic logging middleware
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
// allow serving of UI code
app.use(express.static(`${__dirname}/public/`));

// creating a user
app.post("/user", (req, res) => {
  User.create({
    username: req.body.username,
    fullname: req.body.fullname,
    password: req.body.password,
  })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        message: `post request failed to create user`,
        error: err,
      });
    });
});

// this handler is what is used to get a single thread from the database
app.get("/thread/:id", (req, res) => {
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
app.get("/thread", (req, res) => {
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
app.post("/thread", (req, res) => {
  if (!req.user) {
    res.status(401).json({ mesage: "unauthenticated" });
    return;
  }
  console.log(`request to insert a thread: `, req.body);
  Thread.create({
    name: req.body.name || "",
    description: req.body.description || "",
    author: req.user.username || "",
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
app.delete("/thread/:id", async (req, res) => {
  if (!req.user) {
    res.status(401).json({ mesage: "unauthenticated" });
    return;
  }
  console.log(`request to delete a single thread with id ${req.params}`);

  let thread;

  // get the thread to check if the current user is allow to delete it
  try {
    thread = await Thread.findById(req.params.id);
  } catch (err) {
    res.status(500).json({
      message: `failed to delete thread`,
      error: err,
    });
    return;
  }

  // check if we found it
  if (thread === null) {
    res.status(404).json({
      message: `thread not found`,
      thread_id: req.params.thread_id,
      post_id: req.params.post_id,
    });
    return;
  }

  // check if the current user made the post

  if (thread.author != req.user.username) {
    res.status(403).json({ mesage: "unauthorized" });
    return;
  }

  // delete the post
  try {
    await Thread.findByIdAndDelete(req.params.id);
  } catch (err) {
    res.status(500).json({
      message: `failed to delete post`,
      error: err,
    });
    return;
  }

  // return
  res.status(200).json(thread);
});

// this handler is what is used to insert a post
app.post("/post", (req, res) => {
  if (!req.user) {
    res.status(401).json({ mesage: "unauthenticated" });
    return;
  }
  console.log(`request to insert a post: `, req.body);
  let post;
  // add the post to the db

  Thread.findByIdAndUpdate(
    req.body.thread_id,
    {
      $push: {
        posts: new Post({
          author: req.user.username,
          body: req.body.body,
          thread_id: req.body.thread,
        }),
      },
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
app.delete("/thread/:thread_id/post/:post_id", async (req, res) => {
  console.log(`request to delete a post:`, req.params.post_id);
  if (!req.user) {
    res.status(401).json({ mesage: "unauthenticated" });
    return;
  }

  let id = req.params.post_id;
  let thread;
  let post;

  // get the thread to check if the current user is allow to delete it
  try {
    thread = await Thread.findOne({
      _id: req.params.thread_id,
      "posts._id": req.params.post_id,
    });
  } catch (err) {
    res.status(500).json({
      message: `failed to delete post`,
      error: err,
    });
    return;
  }

  // check if we found it
  if (thread === null) {
    res.status(404).json({
      message: `thread not found`,
      thread_id: req.params.thread_id,
      post_id: req.params.post_id,
    });
    return;
  }

  // check if the current user made the post
  for (let key in thread.posts) {
    console.log(key);
    post = thread.posts[key];
    if (post._id == id) {
      if (post.author != req.user.username) {
        res.status(403).json({ mesage: "unauthorized" });
        return;
      }
    }
    break;
  }

  // delete the post
  try {
    await Thread.findByIdAndUpdate(req.params.thread_id, {
      $pull: {
        posts: {
          _id: req.params.post_id,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      message: `failed to delete post`,
      error: err,
    });
    return;
  }

  // return
  res.status(200).json(post);
});

module.exports = app;
