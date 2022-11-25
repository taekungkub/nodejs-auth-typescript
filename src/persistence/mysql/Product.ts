import { string } from "joi";
import { conn } from "../../config/dbConnect";
import { ProductTy } from "../../Types/ProductTy";

export const getProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const [rows] = await conn.query("SELECT * FROM tb_product");
      const [rows] = await conn.query(`
      SELECT *
      FROM tb_product
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

export const createProduct = (item: ProductTy, image?: string | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query(
        "INSERT INTO tb_product ( userId , title, metaTitle, price , discount , quantity ,category_id, image ,createdAt) VALUES (?,?,?,?,?,?,?,?,NOW())",
        [item.userId, item.title, item.metaTitle, item.price, item.discount, item.quantity, item.category_id, image]
      );
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateProduct = (item: ProductTy, imageName?: string | null, id?: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("UPDATE tb_product SET ? , image =? WHERE id = ?", [item, imageName, id]);
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

export const addProductCatagory = (productId: number, productData: ProductTy) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await conn.query("INSERT INTO tb_product_category (product_id , category_id) VALUES (?,?)", [
        productId,
        productData.category_id,
      ]);
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};
