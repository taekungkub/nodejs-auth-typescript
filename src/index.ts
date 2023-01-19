import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as db from "./config/dbConnect";
import { MysqlServices } from "./config/mysqlService";
import mysql from "mysql2/promise";
import dbConfig from "./config/dbConfig";
import bodyParser from "body-parser";
var cors = require("cors");

const app: Express = express();

//------------ Config -------------------//
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//------------ DB Connection ------------//
// db.init()
//   .then(() => {
//     console.log("DB is Connected");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

MysqlServices.pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
  timezone: dbConfig.timezone,
});

MysqlServices.pool
  .getConnection()
  .then(() => {
    console.log("Connection to the DB successful");
  })
  .catch((err) => {
    console.error("Error connecting to DB: ", err);
  });

//------------ Routes -------------------//
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/product"));
app.use("/users", require("./routes/user"));

//------------ Port ---------------------//
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port} mode ${process.env.NODE_ENV}`);
});
