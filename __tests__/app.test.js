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
            comment_count: "11",
          });
        });
    });
    test("200: Responds with new property of comment_count which has the correct number of comments by article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("11");
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
    test("400: Responds with bad request if the input of the votes is not of the correct data type", () => {
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
describe("/api/articles (queries)", () => {
  describe("GET", () => {
    test("200: Responds with array of article objects with its properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
    test("200: Responds with array of articles objects sorted in descending order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("200: Accepts an existing topic query which sorts the articles by default order (descending)", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("cats", { descending: true });
        });
    });
    test("200: Returns an array of all article objects sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("200: Should return an array of all article objects sorted by created_at in ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });
    test("200: Should return an array of all article objects when passed 2 queries", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", { descending: false });
        });
    });
    test("200: Should return an array of article objects of only the passed topic query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
    });
    test("400: Responds with an empty array if the topic query does not exist", () => {
      return request(app)
        .get("/api/articles?topic=apples")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    });
  });
  test("400: Responds with bad request when passed an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=aubergine")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("error 400: bad request");
      });
  });
  test("400: Responds with bad request when passed an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=cringe")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("error 400: bad request");
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: Responds with an array of all comments when given the article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(11);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                article_id: 1,
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("200: Responds with an empty articles array when no comments are found with an existing article_id", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("400: Responds with a bad request if article_id is invalid/of the wrong data type", () => {
      return request(app)
        .get("/api/articles/applebottomjeans/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
    test("404: Responds with does not exist if article_id does not exist", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("error 404: does not exist.");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test("201: Should take a username and body property and respond with the posted comment", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "butter_bridge", body: "coolio" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            body: "coolio",
            votes: 0,
            author: "butter_bridge",
            article_id: 2,
            comment_id: expect.any(Number),
            created_at: expect.any(String),
          });
          return db
            .query("SELECT * FROM comments WHERE article_id = 2;")
            .then((response) => {
              expect(response.rows[0]).toEqual({
                body: "coolio",
                votes: 0,
                author: "butter_bridge",
                article_id: 2,
                comment_id: expect.any(Number),
                created_at: expect.any(Object),
              });
            });
        });
    });
    test("400: Responds with bad request if article_id is invalid", () => {
      return request(app)
        .post("/api/articles/applepie/comments")
        .send({ username: "butter_bridge", body: "coolio" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
    test("400: Responds with a bad request if no username is inputted", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "", body: "coolio" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
    test("400: Responds with bad request if no body is inputted", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "butter_bridge", body: "" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
    test("404: Responds with does not exist if article_id does not exist", () => {
      return request(app)
        .post("/api/articles/1000/comments")
        .send({ username: "butter_bridge", body: "coolio" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("error 404: does not exist.");
        });
    });
    test("404: Responds with does not exist if user does not exist", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "me", body: "hello" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("error 404: does not exist.");
        });
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204: Deletes a comment when passed a valid id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("400: Responds with bad request if comment_id is invalid", () => {
      return request(app)
        .delete("/api/comments/what")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("error 400: bad request.");
        });
    });
    test("404: Responds with not found if comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/1010101010")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("error 404: not found");
        });
    });
  });
});
