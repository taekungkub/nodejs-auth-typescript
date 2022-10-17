import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
var bodyParser = require("body-parser");
import * as db from "./config/dbConnect";

const app: Express = express();

//------------ Config -------------------//
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//------------ DB Connection ------------//
db.init()
  .then(() => {
    console.log("DB is Connected");
  })
  .catch((error) => {
    console.log(error);
  });

//------------ Routes -------------------//
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/product"));

//------------ Port ---------------------//
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port} mode ${process.env.NODE_ENV}`);
});
