
import supertest from "supertest";
import app from "../src/app";
import prisma from "../src/database";
import { faker } from '@faker-js/faker';
import httpStatus from "http-status";

import { generateRandomNews, persistNewRandomNews } from "./factories/news-factory";

const api = supertest(app);

beforeEach(async () => {
  await prisma.news.deleteMany();
});

describe("GET /news", () => {
  let newsId: string;

  beforeEach(async () => {
    const response = await api
      .post("/news")
      .send({
        title: "Driven",
        text: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        author: "John Doe",
        publicationDate: "2025-02-10",
        firstHand: true
      });
    newsId = response.body.id;
  });

  it("should return news with pagination, sorting, and title filter", async () => {
    const response = await api
      .get("/news")
      .query({ page: 1, order: "asc", title: "Driven" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.page).toBe(1);
    expect(response.body.order).toBe("asc");
    expect(response.body.data[0].title).toBe("Driven");
  });


  it("should return first page of news when no page is provided", async () => {
    const response = await api
      .get("/news")
      .query({ order: "desc" });

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.order).toBe("desc");
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should return news sorted by date in descending order by default", async () => {
    const response = await api
      .get("/news")
      .query({ page: 1 });

    expect(response.status).toBe(200);
    expect(response.body.order).toBe("desc");
    const publicationDates = response.body.data.map((news: any) => news.publicationDate);
    const sortedDates = [...publicationDates].sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
    expect(publicationDates).toEqual(sortedDates);
  });

  it("should return filtered news by title", async () => {
    const response = await api
      .get("/news?page=1&order=asc&title=Driven")
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].title).toBe("Driven");
  });

  it("should return an empty list if no news matches the title filter", async () => {
    const response = await api
      .get("/news")
      .query({ title: "Nonexistent Title" });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
  });
});

describe("POST /news", () => {
  it("should create news", async () => {
    const newsBody = generateRandomNews();

    const { body, status } = await api.post("/news").send(newsBody);
    expect(status).toBe(httpStatus.CREATED);
    expect(body).toMatchObject({
      id: expect.any(Number),
      text: newsBody.text
    });

    const news = await prisma.news.findUnique({
      where: {
        id: body.id
      }
    });

    expect(news).not.toBeNull();
  });

  it("should return 422 when body is not valid", async () => {
    const { status } = await api.post("/news").send({});
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 409 when title already exist", async () => {
    const news = await persistNewRandomNews();
    const newsBody = { ...generateRandomNews(), title: news.title };
    const { status } = await api.post("/news").send(newsBody);
    expect(status).toBe(httpStatus.CONFLICT);
  });

  it("should return 400 when text is less than 500 chars", async () => {
    const newsBody = generateRandomNews();
    newsBody.text = "short";

    const { status } = await api.post("/news").send(newsBody);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 400 when publication date is in the past", async () => {
    const newsBody = generateRandomNews();
    newsBody.publicationDate = faker.date.past({ years: 1 });

    const { status } = await api.post("/news").send(newsBody);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

});

describe("DELETE /news", () => {
  it("should delete a news", async () => {
    const { id: newsId } = await persistNewRandomNews();
    const { status } = await api.delete(`/news/${newsId}`);

    expect(status).toBe(httpStatus.NO_CONTENT);

    const news = await prisma.news.findUnique({
      where: {
        id: newsId
      }
    });

    expect(news).toBeNull();
  });

  it("should return 404 when id is not found", async () => {
    const { status } = await api.delete(`/news/1`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 400 when id is not valid", async () => {
    const { status } = await api.delete(`/news/0`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

});

describe("PUT /news", () => {
  it("should update a news", async () => {
    const { id: newsId } = await persistNewRandomNews();
    const newsData = generateRandomNews();

    const { status } = await api.put(`/news/${newsId}`).send(newsData);
    expect(status).toBe(httpStatus.OK);

    const news = await prisma.news.findUnique({
      where: {
        id: newsId
      }
    });

    expect(news).toMatchObject({
      text: newsData.text,
      title: newsData.title
    });
  });

  it("should return 404 when id is not found", async () => {
    const newsData = generateRandomNews();

    const { status } = await api.put(`/news/1`).send(newsData);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 400 when id is not valid", async () => {
    const { status } = await api.delete(`/news/0`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 409 when title already exist", async () => {
    const news = await persistNewRandomNews();
    const news2 = await persistNewRandomNews();

    const newsBody = { ...generateRandomNews(), title: news2.title };
    const { status } = await api.put(`/news/${news.id}`).send(newsBody);
    expect(status).toBe(httpStatus.CONFLICT);
  });

  it("should return 400 when text is less than 500 chars", async () => {
    const news = await persistNewRandomNews();
    const newsBody = generateRandomNews();
    newsBody.text = "short";

    const { status } = await api.put(`/news/${news.id}`).send(newsBody);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 400 when publication date is in the past", async () => {
    const news = await persistNewRandomNews();
    const newsBody = generateRandomNews();
    newsBody.publicationDate = faker.date.past({ years: 1 });

    const { status } = await api.put(`/news/${news.id}`).send(newsBody);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });
});

describe("GET /news", () => {
  it("should return paginated news (with page 2)", async () => {
    const response = await api.get("/news?page=2&size=10&order=desc");
    expect(response.status).toBe(200);
  });
});