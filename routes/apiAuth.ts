import express from "express";
import { CustomError } from "../errors/errorHandler";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const apiAuthRouter: express.Router = express.Router();
apiAuthRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiAuthRouter.post(
  "/login",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: req.body.username,
        },
      });
      if (req.body.username === user?.username) {
        let hash = crypto
          .createHash("SHA512")
          .update(req.body.password)
          .digest("hex");
        if (hash === user?.password) {
          let token = jwt.sign({}, "secret");
          res.json({ token: token });
        } else {
          next(
            new CustomError(401, "Virheellinen käyttäjätunnus tai salasana")
          );
        }
      } else {
        next(new CustomError(401, "Virheellinen käyttäjätunnus tai salasana"));
      }
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiAuthRouter;
