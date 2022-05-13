const mongoose = require("mongoose");

// const MongoURI =
//   process.env.MONGODB_URL ||
//   "mongodb://admin:admin987@cluster0-shard-00-00.r3fs6.mongodb.net:27017,cluster0-shard-00-01.r3fs6.mongodb.net:27017,cluster0-shard-00-02.r3fs6.mongodb.net:27017/auth?authSource=admin&replicaSet=atlas-638q0p-shard-0&readPreference=primary&ssl=true";

const MongoURI = process.env.MONGODB_URL || "mongodb://localhost:27017/auth";
//------------ Mongo Connection ------------//
export default function dbConnect() {
  mongoose
    .connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err: Error) => console.log(err));
}
