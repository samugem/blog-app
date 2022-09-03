import express from "express";
import { CustomError } from "../errors/errorHandler";
import { PrismaClient } from "@prisma/client";

const apiAdminRouter: express.Router = express.Router();
apiAdminRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiAdminRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(
        await prisma.blogPost.findMany({
          where: { authorId: Number(1) },
        })
      );
    } catch (e: any) {
      next(new CustomError());
    }
  }
);
apiAdminRouter.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(
        await prisma.blogPost.create({
          data: {
            header: req.body.header,
            authorId: req.body.authorId,
            content: req.body.content,
            imgUrl: req.body.imgUrl,
            published: req.body.published || false,
            liked: 0,
            disliked: 0,
          },
        })
      );
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiAdminRouter;
