const mongoose = require("mongoose");
import mysql from "mysql2/promise";
let conn: any;
import dbConfig from "./dbConfig";

// const MongoURI =
//   process.env.MONGODB_URL ||
//   "mongodb://admin:admin987@cluster0-shard-00-00.r3fs6.mongodb.net:27017,cluster0-shard-00-01.r3fs6.mongodb.net:27017,cluster0-shard-00-02.r3fs6.mongodb.net:27017/auth?authSource=admin&replicaSet=atlas-638q0p-shard-0&readPreference=primary&ssl=true";

// const MongoURI = process.env.MONGODB_URL || "mongodb://localhost:27017/auth";
// //------------ Mongo Connection ------------//
// export default function dbConnect() {
//   mongoose
//     .connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("Successfully connected to MongoDB"))
//     .catch((err: Error) => console.log(err));
// }

async function init() {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        password: dbConfig.password,
        port: dbConfig.port,
        timezone: dbConfig.timezone,
      });
      if (connection) {
        conn = connection;
        resolve(conn);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function teardown() {
  return new Promise(async (resolve, rej) => {
    try {
      await conn.end();
      resolve("");
    } catch (error) {
      rej(error);
    }
  });
}

export { init, conn, teardown };
