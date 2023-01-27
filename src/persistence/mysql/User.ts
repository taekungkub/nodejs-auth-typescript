import { MysqlServices } from "../../config/mysqlService";
import { UserTy } from "../../Types/UserTy";
const { v4: uuidv4 } = require("uuid");

export const createUser = async (user: UserTy) => {
  try {
    const [rows] = await MysqlServices.pool.query(
      "INSERT INTO tb_user ( user_email, user_password, user_displayname , user_tel  , user_created) VALUES (?,?,?,?,NOW())",
      [user.user_email, user.user_password_hash, user.user_displayname, user.user_tel]
    );
    if (!rows) {
      return Promise.reject("create user error");
    }
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    // const [rows] = await conn.query("SELECT * FROM tb_user WHERE user_email = ?", [email]);
    const [rows] = (await MysqlServices.pool.query(
      `
      SELECT *
      FROM tb_user
      LEFT OUTER JOIN tb_role_user
      ON tb_user.id = tb_role_user.user_id
      LEFT OUTER JOIN tb_role
      ON tb_role_user.role_id = tb_role.role_id
      WHERE user_email = ?
      `,
      [email]
    )) as Array<any>;

    if (rows.length === 0) {
      return Promise.reject("User not found");
    }

    return Promise.resolve(rows[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUsers = async () => {
  try {
    const rows = await MysqlServices.pool.query(`
      SELECT * FROM tb_user 
      LEFT OUTER JOIN tb_role_user
      ON tb_user.id = tb_role_user.user_id
      LEFT OUTER JOIN tb_role
      ON tb_role_user.role_id = tb_role.role_id
      `);
    if (!rows) {
      return Promise.reject("Users not found");
    }
    return Promise.resolve(rows[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updatePassword = async (password: string, id: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_user SET user_password=? WHERE id = ?", [password, id]);
    if (!rows) {
      return Promise.reject("Error update password");
    }

    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateResetPasswordToken = async (passwordToken: string, email: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_user SET reset_password_token=? WHERE user_email = ?", [passwordToken, email]);
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeResetPasswordToken = async (email: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_user SET reset_password_token=? WHERE user_email = ?", ["", email]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateStatusVerify = async (status: boolean, email: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_user SET is_verify=? WHERE user_email = ?", [status, email]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProfile = async (id: string, userData: UserTy) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_user SET ? WHERE id = ?", [userData, id]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUser = async (userData: UserTy, id: string) => {
  try {
    const rows = (await MysqlServices.pool.query("UPDATE tb_user SET user_displayname = ?, user_tel = ?, is_verify = ? WHERE id = ?", [
      userData.user_displayname,
      userData.user_tel,
      userData.is_verify,
      id,
    ])) as Array<any>;

    return Promise.resolve(rows[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const removeUser = async (id: String) => {
  try {
    const [rows] = (await MysqlServices.pool.query("DELETE FROM tb_user  WHERE id = ?", [id])) as Array<any>;

    if (!rows) {
      return Promise.reject("Error delete user");
    }

    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addRoleUser = async (roleId: String, userId: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("INSERT INTO tb_role_user ( role_id, user_id) VALUES (?,?)", [roleId, userId]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateRoleUser = async (roleId: String, userId: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_role_user SET role_id=?  WHERE user_id = ?", [roleId, userId]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const [rows] = (await MysqlServices.pool.query(
      `
      SELECT *
      FROM tb_user
      LEFT OUTER JOIN tb_role_user
      ON tb_user.id = tb_role_user.user_id
      LEFT OUTER JOIN tb_role
      ON tb_role_user.role_id = tb_role.role_id
      WHERE id = ?
      `,
      [id]
    )) as Array<any>;

    if (rows.length === 0) {
      return Promise.reject("User not found");
    }

    return Promise.resolve(rows[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserLog = async (id: string) => {
  try {
    const [rows] = (await MysqlServices.pool.query("SELECT * FROM tb_user_activity_log WHERE user_id = ?", [id])) as Array<any>;

    if (rows.length === 0) {
      return Promise.reject("Logs not found");
    }

    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};
