const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

exports.selectArticleId = (id) => {
  return db
    .query(
      `SELECT articles.* FROM articles JOIN users ON users.username = articles.author WHERE articles.article_id = $1;`,
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
