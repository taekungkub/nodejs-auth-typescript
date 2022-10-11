import { connection } from "../../config/dbConnect";
import { UserTy } from "../../config/types";
const { v4: uuidv4 } = require("uuid");

const createUser =  (user: UserTy) => {
  return new Promise(async (resolve, reject) => {
  try {
    const rows = await connection.query(
      'INSERT INTO tb_user (id, email, password, displayname , tel) VALUES (?,?,?,?,?)',
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
      const rows = await connection.query('SELECT * FROM tb_user WHERE email = ?' ,[email])
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
      const rows = await connection.query('SELECT * FROM tb_user')
      if(rows) {
        resolve(rows[0])
      }
    } catch (error) {
      reject(error)
    }

  })
}


const changePassword = (id:string , password:string)=>{
  return new Promise(async(resolve , reject)=>{
    try {
      const rows = await connection.query('UPDATE tb_user SET password=? WHERE id = ?' ,[password , id])
      if(rows) {
        resolve(rows[0][0])
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
  changePassword
};
