import { Request, Response } from "express";
import httpStatus from "http-status";

import * as service from "../services/news-service";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

const INVALID_ID_MESSAGE = "Id is not valid.";

function parseNewsId(req: Request): number | null {
  const newsId = parseInt(req.params.id);
  return isNaN(newsId) || newsId <= 0 ? null : newsId;
}

export async function getNews(req: Request, res: Response) {
  const news = await service.getNews();
  return res.send(news);
}

export async function getSpecificNews(req: Request, res: Response) {
  const newsId = parseNewsId(req);
  if (!newsId) return res.status(httpStatus.BAD_REQUEST).send(INVALID_ID_MESSAGE);

  const news = await service.getSpecificNews(newsId);
  return res.send(news);
}

export async function createNews(req: Request, res: Response) {
  const newsData = req.body as CreateNewsData;
  const createdNews = await service.createNews(newsData);
  return res.status(httpStatus.CREATED).send(createdNews);
}

export async function alterNews(req: Request, res: Response) {
  const newsId = parseNewsId(req);
  if (!newsId) return res.status(httpStatus.BAD_REQUEST).send(INVALID_ID_MESSAGE);

  const newsData = req.body as AlterNewsData;
  const alteredNews = await service.alterNews(newsId, newsData);
  return res.send(alteredNews);
}

export async function deleteNews(req: Request, res: Response) {
  const newsId = parseNewsId(req);
  if (!newsId) return res.status(httpStatus.BAD_REQUEST).send(INVALID_ID_MESSAGE);

  await service.deleteNews(newsId);
  return res.sendStatus(httpStatus.NO_CONTENT);
}
