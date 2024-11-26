const db = require('../db/connection');

exports.selectCommentCountByArticleId = (article_id) => {
  return db
    .query('SELECT COUNT(*) FROM comments WHERE article_id = $1;', [article_id])
    .then(({rows}) => {
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
    return db
      .query('SELECT * FROM comments WHERE article_id = $1;', [article_id])
      .then(({rows}) => {
        return rows;
      });
  };