const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

exports.selectArticleId = (id) => {
  return db
    .query(`SELECT articles.* FROM articles WHERE articles.article_id = $1`, [
      id,
    ])
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
