import { conn } from "../../config/dbConnect";

export const createLog = async (userId: string, logDesc: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("INSERT INTO tb_user_activity_log ( user_id , log_description) VALUES (?,?)", [userId, logDesc]);
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};
