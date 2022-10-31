const db = require("../db/connection");
const format = require("pg-format");
const { response } = require("../app");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

exports.selectArticleId = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count
        FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows: [response] }) => {
      if (!response) {
        return Promise.reject({
          status: 404,
          msg: "error 404: does not exist.",
        });
      }
      return response;
    });
};
exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((response) => {
    return response.rows;
  });
};

exports.updatedArticle = (id, votes) => {
  const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  return db.query(query, [votes, id]).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "error 404: does not exist",
      });
    }
    return response.rows[0];
  });
};

exports.selectAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBy = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["DESC", "ASC"];
  if (!validOrders.includes(order) || !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "error 400: bad request" });
  }
  let queryString = `SELECT articles.*, COUNT(comment_id)::INT AS comment_count
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  let queryValues = [];
  if (topic) {
    queryString += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryString, queryValues).then((response) => {
    return response.rows;
  });
};

exports.selectAllComments = (id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return db
          .query("SELECT * FROM articles WHERE article_id = $1;", [id])
          .then((result) => {
            if (result.rows.length > 0) {
              return response.rows;
            }
            return Promise.reject({
              status: 404,
              msg: "error 404: does not exist.",
            });
          });
      }

      return response.rows;
    });
};

exports.addComment = (id, body, username) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "error 400: bad request." });
  }
  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *;",
      [id, body, username]
    )
    .then((response) => {
      return response.rows[0];
    });
};
exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "error 404: not found" });
      }
    });
};
