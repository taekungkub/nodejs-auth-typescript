import express, { Express } from "express";
import mysql from "mysql2/promise";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";

import { MysqlServices } from "./config/mysqlService";
import { createClient } from "redis";
import { PassportService } from "./config/passportService";
import { RedisService } from "./config/redisService";
import { swaggerSpec } from "./docs";
import dbConfig from "./config/dbConfig";

//------------ Routes -------------------//
import indexRoutes from "./routes/index";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import roleRoutes from "./routes/role";
import orderRoutes from "./routes/order";
import taskRoutes from "./routes/task";

//------------ Config -------------------//
const app: Express = express();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
PassportService.passport.initialize();
//------------ DB Connection ------------//

MysqlServices.pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
});

MysqlServices.pool
  .getConnection()
  .then(() => console.log("Connection to the DB "))
  .catch((err) => console.error("Error connecting to DB: ", err));

//------------ Redis Connection --------------//

(async () => {
  RedisService.cache = createClient();
  RedisService.cache
    .connect()
    .then(() => console.log("Connection to the redis "))
    .catch((err) => console.error("Error connecting to redis: ", err));
})();

//------------ Routes -------------------//
const router = express.Router({ mergeParams: true });
router.use(indexRoutes);
router.use(authRoutes);
router.use(productRoutes);
router.use(userRoutes);
router.use(roleRoutes);
router.use(orderRoutes);
router.use(taskRoutes);
app.use("/api", router);

// v1
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));
// v2
// const fileContents = fs.readFileSync("./src/api-document.yaml", "utf8");
// const doc: any = ymal.load(fileContents);
// v3
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".models { display: none !important; }",
  })
);

//------------ Port ---------------------//
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`⚡️ Environments: .env.${process.env.NODE_ENV}`);
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
