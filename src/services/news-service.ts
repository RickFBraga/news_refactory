import prisma from "../database";
import * as newsRepository from "../repositories/news-repository";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

export async function getAllNews() {
  return newsRepository.getAllNews();
}

export async function getNewsById(id: number) {
  const news = await newsRepository.getNewsById(id);

  if (!news) {
    throw createError("NotFound", `News with id ${id} not found.`);
  }

  return news;
}

export async function createNewNews(newsData: CreateNewsData) {
  await validateNewsData(newsData);
  return newsRepository.createNewNews(newsData);
}

export async function updateNews(id: number, newsData: AlterNewsData) {
  const currentNews = await getNewsById(id);

  await validateNewsData(newsData, currentNews.title !== newsData.title);

  return newsRepository.updateNews(id, newsData);
}

export async function deleteNews(id: number) {
  await getNewsById(id);
  return newsRepository.removeNews(id);
}

async function validateNewsData(newsData: CreateNewsData, isNew = true) {
  if (isNew) {
    const existingNews = await prisma.news.findFirst({
      where: { title: newsData.title }
    });

    if (existingNews) {
      throw createError("Conflict", `News with title ${newsData.title} already exists`);
    }
  }

  if (newsData.text.length < 500) {
    throw createError("BadRequest", "The news text must be at least 500 characters long.");
  }

  const currentDate = new Date();
  const publicationDate = new Date(newsData.publicationDate);
  if (publicationDate.getTime() < currentDate.getTime()) {
    throw createError("BadRequest", "The publication date cannot be in the past.");
  }
}

function createError(name: string, message: string) {
  return { name, message };
}
