const express = require('express');
const app = express();

const {
    getEndpoints,
    getTopics,
    getArticlesById,
    getArticles,
    getCommentsByArticleId,
    postComment,
    patchArticleVotes,
    removeComment,
    getCommentById,
    getUsers
  } = require('./controllers/news-controller');
const { handlePostgressErrors, handleCustomErrors } = require('./controllers/error-handler');

app.use(express.json());

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticleVotes)
app.delete('/api/comments/:comment_id', removeComment)
app.get('/api/comments/:comment_id', getCommentById)
app.get('/api/users', getUsers)

app.use(handlePostgressErrors)
app.use(handleCustomErrors)

module.exports = app;