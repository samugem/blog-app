import express from "express";

const app: express.Application = express();

const port: number = Number(process.env.PORT || 3001);

app.get("/", function (req, res) {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Servers is running on port ${port}`);
});
