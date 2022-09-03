import express from "express";
import errorHandler from "./errors/errorHandler";
import path from "path";
import apiBlogPostsRouter from "./routes/apiBlogPosts";
import jwt from "jsonwebtoken";
import apiAuthRouter from "./routes/apiAuth";
import apiAdminRouter from "./routes/apiAdmin";
import apiRegistrationRouter from "./routes/apiRegistration";

const app: express.Application = express();
const port: number = Number(process.env.PORT);

const checkToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let token: string = req.headers.authorization!.split(" ")[1];
    jwt.verify(token, "secret");
    next();
  } catch (e: any) {
    res.status(401).json({});
  }
};

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/blog-posts", apiBlogPostsRouter);
app.use("/api/auth", apiAuthRouter);
app.use("/api/registration", apiRegistrationRouter);
app.use("/api/admin", checkToken, apiAdminRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servers is running on port ${port}`);
});
