import { conn } from "../../config/dbConnect";
import { UserTy } from "../../config/types";
const { v4: uuidv4 } = require("uuid");

const createUser =  (user: UserTy) => {
  return new Promise(async (resolve, reject) => {
  try {
    const rows = await conn.query(
      'INSERT INTO tb_user (id, user_email, user_password, user_displayname , user_tel) VALUES (?,?,?,?,?)',
      [uuidv4(), user.user_email, user.user_password_hash, user.user_displayname, user.user_tel]
    )
    resolve(rows)
  } catch (error) {
    reject(error)
  }
  });
};


const getUser = (email:any)=>{
  return new Promise(async(resolve , reject)=>{
    try {
      const rows = await conn.query('SELECT * FROM tb_user WHERE user_email = ?' ,[email])
      if(rows) {
        resolve(rows[0][0])
      }
    } catch (error) {
      reject(error)
    }

  })
}

const getUsers = () =>{
  return new Promise(async(resolve , reject)=>{
    try {
      const rows = await conn.query('SELECT * FROM tb_user')
      if(rows) {
        resolve(rows[0])
      }
    } catch (error) {
      reject(error)
    }

  })
}


const updatePassword = (id:string , password:string)=>{
  return new Promise(async(resolve , reject)=>{
    try {
      const rows = await conn.query('UPDATE tb_user SET user_password=? WHERE id = ?' ,[password , id])
      if(rows) {
        resolve(rows[0][0])
      }
    } catch (error) {
      reject(error)
    }

  })

}





const updateResetPasswordToken =(passwordToken:string , email:string) =>{
  return new Promise(async(resolve , reject)=>{
    try {
      const rows = await conn.query('UPDATE tb_user SET reset_password_token=? WHERE user_email = ?' ,[passwordToken , email])
      if(rows) {
        resolve(rows)
      }
    } catch (error) {
      reject(error)
    }
  })
}

const removeResetPasswordToken =(email:string) =>{
  return new Promise(async(resolve , reject)=>{
    try {
      const rows = await conn.query('UPDATE tb_user SET reset_password_token=? WHERE user_email = ?' ,["" , email])
      if(rows) {
        resolve(rows)
      }
    } catch (error) {
      reject(error)
    }
  })
}


export default {
  createUser,
  getUsers,
  getUser,
  updatePassword,
  updateResetPasswordToken,
  removeResetPasswordToken
};
