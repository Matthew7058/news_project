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

exports.insertComment = ({ article_id, username, body}) => {
    if(body == "") {
        return Promise.reject({ status: 400, msg: "comment is empty"})
      }
    
    return db
        .query('INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;',
            [body, article_id, username]
        )
        .then(({rows}) => {
            return rows[0]
        })
}