const { selectArticleById, selectArticles, updateArticleVotes, selectArticlesWithCommentCount } = require('../models/articles-model.js');
const { selectCommentCountByArticleId, selectCommentsByArticleId, insertComment, deleteComment, selectCommentByCommentId } = require('../models/comments-model.js');
const { displayEndpoints } = require('../models/endpoints-model.js');
const { selectTopics } = require('../models/topics-model');
const { selectUserByUsername, selectUsers } = require('../models/users-model.js');

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
    const { sort_by, order } = req.query;
    selectArticlesWithCommentCount(sort_by, order)
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch(next);
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

exports.removeComment = (req, res, next) => {
    const {comment_id} = req.params
    selectCommentByCommentId(comment_id)
    .then(() => {
        return deleteComment(comment_id)
    })
    .then(() => {
        res.status(204).send()
    })
    .catch(next);
}

exports.getCommentById = (req, res, next) => {
    const {comment_id} = req.params
    selectCommentByCommentId(comment_id)
    .then((comment) => {
        res.status(200).send(comment)
    })
    .catch(next);
}

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch(next);
}