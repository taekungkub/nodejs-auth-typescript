import { MysqlServices } from "../../config/mysqlService";

export const getRoles = async () => {
  try {
    const [rows] = await MysqlServices.pool.query("SELECT * FROM  tb_role");
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createRole = async (roleTitle: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("INSERT INTO tb_role (role_title) VALUES (?)", [roleTitle]);
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};
