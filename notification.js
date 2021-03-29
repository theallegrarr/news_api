const mongoose = require("mongoose")
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 3,
      unique: false
    },
    type: {
      type: String,
      minlength: 3,
      unique: false
    },
  }
)

const Notification = mongoose.model("notification", NotificationSchema);
module.exports = Notification;