import prisma from "../database";
import * as newsRepository from "../repositories/news-repository";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

export async function getNews(page: number, order: string, titleFilter: string) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const news = await newsRepository.getNews(pageSize, skip, order, titleFilter);

  return {
    data: news,
    page: page,
    order: order
  };
}

export async function getNewsById(newsId: number) {
  const news = await newsRepository.getNewsById(newsId);
  if (!news) {
    throw createError("NotFound", `News with id ${newsId} not found.`);
  }
  return news;
}

export async function createNews(newsData: CreateNewsData) {
  await validateNewsData(newsData);
  return newsRepository.createNews(newsData);
}

export async function updateNews(newsId: number, newsData: AlterNewsData) {
  const existingNews = await getNewsById(newsId);
  await validateNewsData(newsData, existingNews.title !== newsData.title);

  return newsRepository.updateNews(newsId, newsData);
}

export async function deleteNews(newsId: number) {
  await getNewsById(newsId);
  return newsRepository.deleteNews(newsId);
}


async function validateNewsData(newsData: CreateNewsData, checkTitleUniqueness = true) {
  if (checkTitleUniqueness) {
    await ensureUniqueTitle(newsData.title);
  }

  ensureMinimumTextLength(newsData.text);
  ensureValidPublicationDate(newsData.publicationDate);
}


async function ensureUniqueTitle(title: string) {
  const existingNews = await prisma.news.findFirst({ where: { title } });

  if (existingNews) {
    throw createError("Conflict", `News with title "${title}" already exists.`);
  }
}


function ensureMinimumTextLength(text: string) {
  if (text.length < 500) {
    throw createError("BadRequest", "The news text must be at least 500 characters long.");
  }
}


function ensureValidPublicationDate(date: string | Date) {
  const publicationDate = new Date(date);
  if (publicationDate.getTime() < Date.now()) {
    throw createError("BadRequest", "The publication date cannot be in the past.");
  }
}


function createError(name: string, message: string) {
  return { name, message };
}
