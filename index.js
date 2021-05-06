const server = require("./server.js");
const persist = require("./persist");

// grabs the third item in the command used to start the program as the port
const port = process.argv[2];

// set up what happends when the app connects to the database
persist.onConnect(() => {
  server.listen(port, () => {
    console.log(`Code School 2021 Forum App Running on Port ${port}`);
  });
});

// connect to the database
persist.connect("127.0.0.1", "cs-forum-2021");
