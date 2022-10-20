import { conn } from "../../config/dbConnect";
import { ProductTy } from "../../Types/Product";
import { UserTy } from "../../Types/User";

export const getProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const [rows] = await conn.query("SELECT * FROM tb_product");
      const [rows] = await conn.query(`
      SELECT *
      FROM tb_product_category
      INNER JOIN tb_product
      ON tb_product.id = tb_product_category.product_id;
      `);

      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getProduct = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query(
        `SELECT * FROM tb_product 
        INNER JOIN tb_user ON tb_product.userId=tb_user.id 
        WHERE tb_product.id = ?`,
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

export const createProduct = (item: ProductTy) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query(
        "INSERT INTO tb_product ( userId , title, metaTitle, price , discount , quantity , createdAt) VALUES (?,?,?,?,?,?,?)",
        [item.userId, item.title, item.metaTitle, item.price, item.discount, item.quantity, item.createdAt]
      );
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateProduct = (item: ProductTy, id: String) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_product SET ? WHERE id = ?", [item, id]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const removeProduct = (id: String) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("DELETE FROM tb_product  WHERE id = ?", [id]);
      if (rows) {
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};