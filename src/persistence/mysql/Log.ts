import { conn } from "../../config/dbConnect";
import { MysqlServices } from "../../config/mysqlService";

export const createLog = async (id: string, logDesc: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("INSERT INTO tb_user_activity_log ( user_id , log_description) VALUES (?,?)", [
      id,
      logDesc,
    ]);
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLog = async (id: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("SELECT * FROM  tb_user_activity_log WHERE user_id = ?", [id]);
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};
