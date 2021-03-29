/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const Notification = require('./notification')

const connectionUrl = process.env.MONGO_DB_URI;

// this line fixes this warning:
// (node: 18804) DeprecationWarning: collection.ensureIndex is deprecated.Use createIndexes instead.
// it can also be silenced by using the node flag --no-deprecation
mongoose.set('useCreateIndex', true);

connect = async () => {
  try {
    await mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const notif = new Notification({
      title: "new notification",
      type: "message"
    })
    await notif.save()
    console.log("Connected to Database");
  } catch (e) {
    console.log(`Connection to database failed: ${e.message}`);
  }
};

module.exports = connect;