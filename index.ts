import express from "express";
import errorHandler from "./errors/errorHandler";
import path from "path";
import apiBlogPostsRouter from "./routes/apiBlogPosts";

const app: express.Application = express();

const port: number = Number(process.env.PORT);

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/blog-posts", apiBlogPostsRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servers is running on port ${port}`);
});
