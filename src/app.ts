import express, { Request, Response, json } from "express";
import "express-async-errors";

import newsRouter from "./routers/news-router";
import errorHandlingMiddleware from "./middlewares/error-handler";

const app = express();
app.use(json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("I'm ok!");
});

app.use("/news", newsRouter);
app.use(errorHandlingMiddleware);

export default app;