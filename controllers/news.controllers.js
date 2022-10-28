const {
  selectTopics,
  selectArticleId,
  selectUsers,
  updatedArticle,
  selectAllArticles,
  selectAllComments,
  addComment,
} = require("../models/news.models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUsers = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updatedArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order_by, topic } = req.query;
  selectAllArticles(sort_by, order_by, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  selectAllComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  selectArticleId(article_id)
    .then((response) => {
      return addComment(article_id, body, username);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
