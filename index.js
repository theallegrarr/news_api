require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser').json()
const connect = require("./connect");
const newsRouter = require("./routes/news-router");

const app = express();

connect();

app.use(cors())
app.use('/api/news', bodyParser, newsRouter(app))

app.get('/', (req, res, next) => {
  try {
    res
      .status(200)
      .json({
        message: 'Welcome to News Server',
      });
  } catch (error) {
    next(new Error(error));
  }
});

module.exports = app;