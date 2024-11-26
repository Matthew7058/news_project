const { selectArticleById, selectArticles } = require('../models/articles-model.js');
const { selectCommentCountByArticleId, selectCommentsByArticleId } = require('../models/comments-model.js');
const { displayEndpoints } = require('../models/endpoints-model.js');
const { selectTopics } = require('../models/topics-model');

  exports.getEndpoints = (req, res, next) => {
    displayEndpoints().then((endpoints) => {
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
    selectArticles()
    .then((articles) => {
      const articlesWithCommentCount = articles.map((article) => {
        return selectCommentCountByArticleId(article.article_id)
        .then((commentCount) => {
            article.comment_count = parseInt(commentCount.count);
            return article;
        })
      })
      return Promise.all(articlesWithCommentCount)
    })
    .then((articles) => {
        res.status(200).send({ articles });
    })
  };

  exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const promises = [selectCommentsByArticleId(article_id)]
    
    if(article_id) {
        promises.push(selectArticleById(article_id))
    }

    Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
  };