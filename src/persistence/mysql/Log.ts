import { conn } from "../../config/dbConnect";

export const createLog = async (userId: string, log_desc: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("INSERT INTO tb_user_activity_log ( user_id , log_description) VALUES (?,?)", [userId, log_desc]);
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};
