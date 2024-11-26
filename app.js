const express = require('express');
const app = express();

const {
    getEndpoints,
    getTopics,
    getArticlesById,
    getArticles
  } = require('./controllers/news-controller');

app.use(express.json());

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles', getArticles)

app.use((err, req, res, next) => {
    // postgres errors

    if(err.code == "22P02") {
      res.status(400).send({ msg: "Bad request" })
    }
    else if(err.code == "23502") {
      res.status(400).send({ msg: 'Bad request'})
    }
    else {
      next(err)
    }
  })
  
  app.use((err, req, res, next) => {
    // custom errors
    if(err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg })
    }
  })


module.exports = app;