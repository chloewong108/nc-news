const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("200: Responds with array of topic objects with the properties of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          expect(body.topics.length > 0).toBe(true);
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(topic).toHaveProperty("slug", expect.any(String));
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: Responds with an article object with its properties", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          });
        });
    });
    test("404: Responds with does not exist if article_id does not exist", () => {
      return request(app)
        .get("/api/articles/1000000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("error 404: does not exist.");
        });
    });
    test("400: Responds with bad request if article_id is invalid", () => {
      return request(app)
        .get("/api/articles/apple")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
  });
});
describe("/api/users", () => {
  describe("GET", () => {
    test("200: Responds with an array of objects with its properties ", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
});
describe("/api/articles/:article_id", () => {
  describe("PATCH", () => {
    test("200: Updates the votes property with specified amount and responds with the updated article ", () => {
      const patchRequest = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(patchRequest)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBe(101);
        });
    });
    test("400: Responds with bad request if article_id is invalid ", () => {
      const patchRequest = { inc_votes: "hello" };
      return request(app)
        .patch("/api/articles/1")
        .send(patchRequest)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
    test("400: Responds with a bad request if article_id input is of invalid data type", () => {
      const patchRequest = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/bananas")
        .send(patchRequest)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
    test("404: Responds with does not exist when client enters a article_id that does not exist", () => {
      const patchRequest = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1000000")
        .send(patchRequest)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("error 404: does not exist");
        });
    });
  });
});
