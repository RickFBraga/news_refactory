import prisma from "../database";
import * as newsRepository from "../repositories/news-repository";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

export async function getNews() {
  return newsRepository.getNoticias();
}

export async function getSpecificNews(id: number) {
  const news = await newsRepository.getNoticiaById(id);
  if (!news) {
    throw {
      name: "NotFound",
      message: `News with id ${id} not found.`
    }
  }

  return news;
}

export async function createNews(newsData: CreateNewsData) {
  await validate(newsData);
  return newsRepository.createNoticia(newsData);
}

export async function alterNews(id: number, newsData: AlterNewsData) {
  const news = await getSpecificNews(id);
  await validate(newsData, news.title !== newsData.title);

  return newsRepository.updateNoticia(id, newsData);
}

export async function deleteNews(id: number) {
  await getSpecificNews(id);
  return newsRepository.removeNoticia(id);
}

async function validate(newsData: CreateNewsData, isNew = true) {
  // validate if news with specific text already exists
  if (isNew) {
    const newsWithTitle = await prisma.news.findFirst({
      where: { title: newsData.title }
    });

    if (newsWithTitle) {
      throw {
        name: "Conflict",
        message: `News with title ${newsData.title} already exist`
      }
    }
  }

  // checks news text length
  if (newsData.text.length < 500) {
    throw {
      name: "BadRequest",
      message: "The news text must be at least 500 characters long.",
    };
  }

  // checks date
  const currentDate = new Date();
  const publicationDate = new Date(newsData.publicationDate);
  if (publicationDate.getTime() < currentDate.getTime()) {
    throw {
      name: "BadRequest",
      message: "The publication date cannot be in the past.",
    };
  }
}