const { Int32 } = require("bson");
const mongoose = require("mongoose")
const { Schema } = mongoose;

const NewsSchema = new Schema(
  {
    last_check: {
      type: String,
      minlength: 3
    },
    fier: {
      type: Number
    },
    all_news: {
      type: Array,
      unique: false,
    },
  }
)

const News = mongoose.model("news", NewsSchema);
module.exports = News;