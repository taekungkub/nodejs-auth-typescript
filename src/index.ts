import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
var bodyParser = require("body-parser");
import dbConnect from "./config/dbConnect";

const app: Express = express();

//------------ config ------------//
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//------------ Mongo Connection ------------//
dbConnect();

//------------ Routes ------------//
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
