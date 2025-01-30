import joi from "joi";
import { CreateNewsData } from "../repositories/news-repository";

export const newsSchema = joi.object<CreateNewsData>({
  title: joi.string().required(),
  text: joi.string().required(),
  author: joi.string().required(),
  firstHand: joi.boolean().optional(),
  publicationDate: joi.date().required()
});