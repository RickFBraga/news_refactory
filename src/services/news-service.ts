import prisma from "../database";
import * as newsRepository from "../repositories/news-repository";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

export async function getNews() {
  return newsRepository.getNews();
}

export async function getSpecificNews(newsId: number) {
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

export async function alterNews(newsId: number, newsData: AlterNewsData) {
  const existingNews = await getSpecificNews(newsId);
  await validateNewsData(newsData, existingNews.title !== newsData.title);

  return newsRepository.updateNews(newsId, newsData);
}

export async function deleteNews(newsId: number) {
  await getSpecificNews(newsId);
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
