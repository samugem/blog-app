import express from "express";
import { CustomError } from "../errors/errorHandler";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

const apiBlogPostsRouter: express.Router = express.Router();

apiBlogPostsRouter.use(express.json());

apiBlogPostsRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(await prisma.blogPost.findMany());
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiBlogPostsRouter;
