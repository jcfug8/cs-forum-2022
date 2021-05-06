const mongoose = require("mongoose");
const db = mongoose.connection;

/**
 *
 * @param {String} host - the hostname for the server running mongo
 * @param {String} db_name - the name of the database on the mogno instance to be used
 */
function connect(host, db_name) {
  mongoose
    .connect(`mongodb://new_user:password@${host}/${db_name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.log(err);
    });
}

function onConnect(callback) {
  db.once("open", function () {
    callback();
  });
}

module.exports = {
  connect: connect,
  onConnect: onConnect,
};
