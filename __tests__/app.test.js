const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */

const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require("../db/data/test-data/index");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object containing the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe('string');
          expect(typeof topic.slug).toBe('string');
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET 200: sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe('butter_bridge');
        expect(article.body).toBe('I find this existence challenging');
        expect(article.created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article-id')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
});
describe("GET /api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.article_id).toBe('number');
          expect(typeof article.author).toBe('string');
          expect(typeof article.body).toBe('string');
          expect(typeof article.created_at).toBe('string');
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe('string');
          expect(typeof article.comment_count).toBe('number');
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: sends an array of comments to the client", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments.length).toBe(2);
        expect(comments).toEqual([
          {
            comment_id: 10,
            body: 'git push origin master',
            article_id: 3,
            author: 'icellusedkars',
            votes: 0,
            created_at: '2020-06-20T07:24:00.000Z'
          },
          {
            comment_id: 11,
            body: 'Ambidextrous marsupial',
            article_id: 3,
            author: 'icellusedkars',
            votes: 0,
            created_at: '2020-09-19T23:10:00.000Z'
          }
        ])
      });
  });

  test("GET 200: sends an empty array to the client if there are no comments but the article exists", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments.length).toBe(0);
        expect(comments).toEqual([])
      });
  });

  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article-id/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test('POST:201 inserts a new comment to the db and sends the new comment back to the client', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'cool story bro'
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then(({body: {comment}}) => {
        expect(comment.comment_id).toBe(19)
        expect(comment.body).toBe("cool story bro")
        expect(comment.article_id).toBe(3)
        expect(comment.author).toBe('butter_bridge')
        expect(comment.votes).toBe(0)
        expect(typeof comment.created_at).toBe("string")
      });
  });
  test('POST:400 responds with an appropriate status and error message when provided with an invalid comment (no body)', () => {
    const newComment = {
      username: 'butter_bridge'
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  test('POST:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'cool story bro'
    };
    return request(app)
      .post('/api/articles/999/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('POST:204 responds with an appropriate status and error message when provided with an empty body on comment', () => {
    const newComment = {
      username: 'butter_bridge',
      body: ""
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('comment is empty');
      });
  });
  test('POST:404 sends an appropriate status and error message when given a valid but non-existent username', () => {
    const newComment = {
      username: 'john_pork',
      body: 'cool story bro'
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('user does not exist');
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test('POST:200 updates votes on a given article when increasing the number of votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({votes: 10})
      .expect(200)
      .then(({body: {article}}) => {
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe('butter_bridge');
        expect(article.body).toBe('I find this existence challenging');
        expect(article.created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(article.votes).toBe(110);
        expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
      });
  });
  test('POST:200 updates votes on a given article when decreasing the number of votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({votes: -10})
      .expect(200)
      .then(({body: {article}}) => {
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe('butter_bridge');
        expect(article.body).toBe('I find this existence challenging');
        expect(article.created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(article.votes).toBe(90);
        expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .patch('/api/articles/999')
      .send({votes: 10})
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .patch('/api/articles/not-an-article-id')
      .send({votes: 10})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  test('GET:400 sends an appropriate status and error message when votes are invalid', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({votes: "Ten"})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Invalid votes value. Must be an integer.');
      });
  });
  test('GET:400 sends an appropriate status and error message when votes are not passed', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({points: 10})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Invalid votes value. Must be an integer.');
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test('DELETE:204 deletes the specified comment, ensure that the comment is no longer in the databse', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then(() => {
      return request(app)
      .get('/api/comments/1')
      .expect(404)
    })
    .then(({body}) => {
      expect(body.msg).toBe("comment does not exist")
    })
  });
  test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('comment does not exist');
      });
  });
  test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/comments/not-a-comment')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  
});

describe("GET /api/users", () => {
  test("200: Responds with an object containing all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({body: {users}}) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe('string');
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar_url).toBe('string');
        });
      });
  });
});