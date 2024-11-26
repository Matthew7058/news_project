const { selectArticleById, selectArticles, updateArticleVotes } = require('../models/articles-model.js');
const { selectCommentCountByArticleId, selectCommentsByArticleId, insertComment } = require('../models/comments-model.js');
const { displayEndpoints } = require('../models/endpoints-model.js');
const { selectTopics } = require('../models/topics-model');
const { selectUserByUsername } = require('../models/users-model.js');

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

  exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    selectArticleById(article_id)
    .then(() => {
        return selectUserByUsername(username)
    })
    .then(() => {
        return insertComment({article_id, username, body})
    })
    .then((comment) => {
        res.status(201).send({ comment });
    }) 
    .catch(next)
  }

  exports.patchArticleVotes = (req, res, next) => {
    const {article_id} = req.params
    const {votes} = req.body
    
    selectArticleById(article_id)
    .then(() => {
        return updateArticleVotes({article_id, votes})
    })
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
  }