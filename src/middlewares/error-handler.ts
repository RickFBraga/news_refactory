import { Request, Response, NextFunction } from "express";

import httpStatus from "http-status";

type AppError = Error & {
  type: string
}

export default function errorHandlingMiddleware(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction) {

  console.log(error);

  const { name, message } = error;
  if (name === "NotFound") {
    return res.status(httpStatus.NOT_FOUND).send(message);
  } else if (name === "Conflict") {
    return res.status(httpStatus.CONFLICT).send(message);
  } else if (name === "BadRequest") {
    return res.status(httpStatus.BAD_REQUEST).send(message);
  } else if (name === "UnprocessableEntity") {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(message);
  } else if (name === "Forbidden") {
    return res.status(httpStatus.FORBIDDEN).send(message);
  } else {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }

}