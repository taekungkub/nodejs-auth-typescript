import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import { MysqlServices } from "./config/mysqlService";
import mysql from "mysql2/promise";
import dbConfig from "./config/dbConfig";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import docs from "./api-document.json";
import fs from "fs";
import ymal from "js-yaml";
import { createClient } from "redis";
import { PassportService } from "./config/passportService";

//------------ Routes -------------------//
import indexRoutes from "./routes/index";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import roleRoutes from "./routes/role";
import orderRoutes from "./routes/order";
import { RedisService } from "./config/redisService";

//------------ Config -------------------//
const app: Express = express();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
PassportService.passport.initialize();
//------------ DB Connection ------------//

MysqlServices.pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
  timezone: "Asia/Bangkok",
});

MysqlServices.pool
  .getConnection()
  .then(() => console.log("Connection to the DB "))
  .catch((err) => console.error("Error connecting to DB: ", err));

//------------ Redis Connection -------------------//

(async () => {
  RedisService.cache = createClient();
  RedisService.cache
    .connect()
    .then(() => console.log("Connection to the redis "))
    .catch((err) => console.error("Error connecting to redis: ", err));
})();

//------------ Routes -------------------//

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/orders", orderRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));

// const fileContents = fs.readFileSync("./src/api-document.yaml", "utf8");
// const doc: any = ymal.load(fileContents);

//------------ Port ---------------------//
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port} mode ${process.env.NODE_ENV}`);
});
