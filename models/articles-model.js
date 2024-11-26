const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if(!result.rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist"})
      }
      //console.log(result.rows[0])
      return result.rows[0];
    })
};

exports.selectArticles = () => {
    return db.query('SELECT * FROM articles;').then((result) => {
      return result.rows;
    });
};

exports.selectArticlesWithCommentCount = () => {
    return db.query('SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;')
    .then(({rows}) => {
        return rows;
      });
}

exports.updateArticleVotes = ({article_id, votes}) => {
    if (!Number.isInteger(votes)) {
        return Promise.reject({ status: 400, msg: 'Invalid votes value. Must be an integer.' });
    }
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [votes, article_id])
    .then(({rows}) => {
        return rows[0]
    })
}
