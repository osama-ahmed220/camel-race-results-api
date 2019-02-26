import "reflect-metadata";
import Express from "express";
import cors from "cors";
import path from "path";
import BodyParser from "body-parser";
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from "typeorm";
import Router from "./routes";

const main = async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    process.env.NODE_ENV === "production" ? "production" : "default"
  );
  await createConnection({
    ...connectionOptions,
    name: "default"
  });
  const app = Express();
  app.use(BodyParser.json({ limit: "50mb" }));
  app.use(BodyParser.urlencoded({ limit: "50mb", extended: false }));
  app.use(Express.static(path.join(__dirname, "assets")));

  const allowOrigins = process.env.ALLOW_ORIGINS
    ? JSON.parse(process.env.ALLOW_ORIGINS)
    : "*";

  app.use(
    cors({
      credentials: true,
      origin: allowOrigins
    })
  );
  app.get("/", (_, res) => {
    res.send("Working");
  });
  app.use("/api", Router);
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(
      `server is running on post ${port} http://localhost:${port}/api`
    );
  });
};
main();
