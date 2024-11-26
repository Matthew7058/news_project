const db = require('../db/connection');

exports.selectCommentCountByArticleId = (article_id) => {
  return db
    .query('SELECT COUNT(*) FROM comments WHERE article_id = $1;', [article_id])
    .then((result) => {
      return result.rows[0];
    });
};