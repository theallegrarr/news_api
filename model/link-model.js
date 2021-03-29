const mongoose = require("mongoose")
const { Schema } = mongoose;

const LinkSchema = new Schema(
  {
    news_link: {
      type: String,
      minlength: 3
    },
    last_update: {
      type: Date,
      unique: false,
    },
  }
)

const Link = mongoose.model("links", LinkSchema);
module.exports = Link;