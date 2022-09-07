const express = require("express");
const {
  getTopics,
  getArticleId,
  getUsers,
  patchUsers,
} = require("./controllers/topics.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchUsers);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "error 400: bad request." });
  } else next(err);
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
