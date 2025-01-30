import { Request, Response } from "express";
import httpStatus from "http-status";

import * as newsService from "./../services/news-service";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

function validateNewsId(id: string) {
  const parsedId = parseInt(id);
  return !isNaN(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function getNews(req: Request, res: Response): Promise<Response> {
  try {
    const news = await newsService.getNews();
    return res.send(news);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Error fetching news.");
  }
}

export async function getSpecificNews(req: Request, res: Response): Promise<Response> {
  const id = validateNewsId(req.params.id);

  if (!id) {
    return res.status(httpStatus.BAD_REQUEST).send("Invalid news ID.");
  }

  try {
    const news = await newsService.getSpecificNews(id);
    return news ? res.send(news) : res.status(httpStatus.NOT_FOUND).send("News not found.");
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Error fetching news.");
  }
}

export async function createNews(req: Request, res: Response): Promise<Response> {
  const newsData: CreateNewsData = req.body;

  try {
    const createdNews = await newsService.createNews(newsData);
    return res.status(httpStatus.CREATED).send(createdNews);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Error creating news.");
  }
}

export async function alterNews(req: Request, res: Response): Promise<Response> {
  const id = validateNewsId(req.params.id);

  if (!id) {
    return res.status(httpStatus.BAD_REQUEST).send("Invalid news ID.");
  }

  const newsData: AlterNewsData = req.body;

  try {
    const alteredNews = await newsService.alterNews(id, newsData);
    return alteredNews ? res.send(alteredNews) : res.status(httpStatus.NOT_FOUND).send("News not found.");
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Error altering news.");
  }
}

export async function deleteNews(req: Request, res: Response): Promise<Response> {
  const id = validateNewsId(req.params.id);

  if (!id) {
    return res.status(httpStatus.BAD_REQUEST).send("Invalid news ID.");
  }

  try {
    await newsService.deleteNews(id);
    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Error deleting news.");
  }
}
