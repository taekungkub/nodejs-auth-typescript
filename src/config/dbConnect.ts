const mongoose = require("mongoose");
const mysql = require('mysql2/promise');
let connection:any

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
  return new Promise(async (resolve,reject)=>{
  try {
    const _connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'test',
      password:"1234",
      port:4000,
    });
    if(_connection) {
      connection = _connection;
      resolve(_connection)
    }
  } catch (error) {
    reject(error)
  }
  })
  




}


export  {
  init,
  connection
}