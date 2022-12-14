const express = require("express");
const {
  getTopics,
  getArticleId,
  getUsers,
  patchUsers,
  getAllArticles,
  getAllCommentsById,
  postComment,
  deleteCommentById,
  getApi,
} = require("./controllers/news.controllers");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/users", getUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getAllCommentsById);

app.patch("/api/articles/:article_id", patchUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

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
  if (err.code === "23503") {
    res.status(404).send({ msg: "error 404: does not exist." });
  } else next(err);
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
