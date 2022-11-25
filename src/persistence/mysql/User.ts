import { conn } from "../../config/dbConnect";
import { UserTy } from "../../Types/UserTy";
const { v4: uuidv4 } = require("uuid");

const createUser = (user: UserTy) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query(
        "INSERT INTO tb_user ( user_email, user_password, user_displayname , user_tel  , user_created) VALUES (?,?,?,?,NOW())",
        [user.user_email, user.user_password_hash, user.user_displayname, user.user_tel]
      );
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};

const getUserByEmail = (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const [rows] = await conn.query("SELECT * FROM tb_user WHERE user_email = ?", [email]);
      const [rows] = await conn.query(
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
      );
      if (rows) {
        resolve(rows[0]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query(`
      SELECT * FROM tb_user 
      LEFT OUTER JOIN tb_role_user
      ON tb_user.id = tb_role_user.user_id
      LEFT OUTER JOIN tb_role
      ON tb_role_user.role_id = tb_role.role_id
      `);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updatePassword = (password: string, id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_user SET user_password=? WHERE id = ?", [password, id]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateResetPasswordToken = (passwordToken: string, email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_user SET reset_password_token=? WHERE user_email = ?", [passwordToken, email]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const removeResetPasswordToken = (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_user SET reset_password_token=? WHERE user_email = ?", ["", email]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateStatusVerify = (status: boolean, email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_user SET is_verify=? WHERE user_email = ?", [status, email]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProfile = (userData: UserTy) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_user SET ? WHERE id = ?", [userData, userData.id]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (userData: UserTy, id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_user SET user_displayname=?, user_tel=?,is_verify=? WHERE id = ?", [
        userData.user_displayname,
        userData.user_tel,
        userData.is_verify,
        id,
      ]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};
const removeUser = (id: String) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("DELETE FROM tb_user  WHERE id = ?", [id]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const addRoleUser = (roleId: String, userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("INSERT INTO tb_role_user ( role_id, user_id) VALUES (?,?)", [roleId, userId]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateRoleUser = (roleId: String, userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_role_user SET role_id=?  WHERE user_id = ?", [roleId, userId]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getUserById = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query(
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
      );
      if (rows) {
        resolve(rows[0]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getUserLog = async (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("SELECT * FROM  tb_user_activity_log WHERE user_id = ?", [userId]);
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
  updatePassword,
  updateResetPasswordToken,
  removeResetPasswordToken,
  updateStatusVerify,
  updateProfile,
  removeUser,
  addRoleUser,
  updateRoleUser,
  updateUser,
  getUserLog,
};
