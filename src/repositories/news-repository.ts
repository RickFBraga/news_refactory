import prisma from "../database";
import { News } from "@prisma/client";

export type CreateNewsData = Omit<News, "id" | "createAt">;
export type AlterNewsData = CreateNewsData;

function formatPublicationDate(date: string | Date): Date {
  return new Date(date);
}

export async function getNews(pageSize: number, skip: number, order: string, titleFilter: string) {
  return await prisma.news.findMany({
    where: {
      title: {
        contains: titleFilter,
        mode: "insensitive"
      }
    },
    skip: skip,
    take: pageSize,
    orderBy: {
      publicationDate: order === "desc" ? "desc" : "asc"
    }
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
