const express = require('express');
const app = express();

const {
    getEndpoints,
    getTopics
  } = require('./controllers/news-controller');

app.use(express.json());

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)

module.exports = app;