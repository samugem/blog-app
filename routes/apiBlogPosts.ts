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
      res.json(await prisma.blogPost.findMany({ where: { published: true } }));
    } catch (e: any) {
      next(new CustomError());
    }
  }
);
apiBlogPostsRouter.put(
  "/like/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      console.log(id);
      const updatedPost = await prisma.blogPost.update({
        where: { id: Number(id) },
        data: { liked: { increment: 1 } },
      });
      res.json(updatedPost);
    } catch (e: any) {
      next(new CustomError());
    }
  }
);
apiBlogPostsRouter.put(
  "/dislike/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedPost = await prisma.blogPost.update({
        where: { id: Number(id) },
        data: { disliked: { increment: 1 } },
      });
      res.json(updatedPost);
    } catch (e: any) {
      console.log(e);
      next(new CustomError());
    }
  }
);

export default apiBlogPostsRouter;
