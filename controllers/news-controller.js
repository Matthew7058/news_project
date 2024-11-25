const { selectArticleById, selectArticles } = require('../models/articles-model.js');
const { getEndpoints } = require('../models/endpoints-model.js');
const { selectTopics } = require('../models/topics-model');

  exports.getEndpoints = (req, res, next) => {
    getEndpoints().then((endpoints) => {
      res.status(200).send({ endpoints });
    });
  };

  exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
      res.status(200).send({ topics });
    });
  };

  exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
  };

  exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
      res.status(200).send({ articles });
    });
  };