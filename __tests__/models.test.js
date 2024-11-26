const { selectCommentCountByArticleId } = require('../models/comments-model.js');

const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("Comments model", () => {
    test("Gets comment count", () => {
      return selectCommentCountByArticleId(1)
        .then((response) => {
          expect(response.count).toBe("11")
        });
    });
});