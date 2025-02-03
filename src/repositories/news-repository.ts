import prisma from "../database";
import { News } from "@prisma/client";

export type CreateNewsData = Omit<News, "id" | "createAt">;
export type AlterNewsData = CreateNewsData;

function formatPublicationDate(date: string | Date): Date {
  return new Date(date);
}

export async function getNews() {
  return await prisma.news.findMany({
    orderBy: { publicationDate: "desc" },
  });
}

export async function getNewsById(newsId: number) {
  return await prisma.news.findUnique({
    where: { id: newsId },
  });
}

export async function createNews(newsData: CreateNewsData) {
  return await prisma.news.create({
    data: { ...newsData, publicationDate: formatPublicationDate(newsData.publicationDate) },
  });
}

export async function updateNews(newsId: number, newsData: AlterNewsData) {
  return await prisma.news.update({
    where: { id: newsId },
    data: { ...newsData, publicationDate: formatPublicationDate(newsData.publicationDate) },
  });
}

export async function deleteNews(newsId: number) {
  return await prisma.news.delete({
    where: { id: newsId },
  });
}
