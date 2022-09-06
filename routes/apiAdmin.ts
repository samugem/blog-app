import express from "express";
import { CustomError } from "../errors/errorHandler";
import { PrismaClient } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

const apiAdminRouter: express.Router = express.Router();
apiAdminRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiAdminRouter.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      res.json(
        await prisma.blogpost.findMany({
          where: { authorId: Number(id) },
          orderBy: {
            timestamp: "desc",
          },
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
        await prisma.blogpost.create({
          data: {
            header: req.body.header,
            authorId: req.body.authorId,
            imgUrl: req.body?.imgUrl,
            content: sanitizeHtml(req.body.content),
            published: req.body.published,
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
apiAdminRouter.put(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedPost = await prisma.blogpost.update({
        where: { id: Number(id) },
        data: {
          header: req.body.header,
          authorId: req.body.authorId,
          imgUrl: req.body?.imgUrl,
          content: sanitizeHtml(req.body.content),
          published: req.body.published,
        },
      });
      res.json(updatedPost);
    } catch (e: any) {
      console.log(e);
      next(new CustomError());
    }
  }
);
apiAdminRouter.delete(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedPost = await prisma.blogpost.delete({
        where: { id: Number(id) },
      });
      res.json(updatedPost);
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiAdminRouter;
