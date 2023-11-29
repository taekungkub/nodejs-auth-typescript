import { MysqlServices } from "@/config/mysqlService";
import { ProductTy } from "@/types/ProductTy";
import { OkPacket, RowDataPacket } from "mysql2";

export const getProducts = async () => {
  try {
    // const [rows] = await conn.query("SELECT * FROM tb_product");
    const [rows] = await MysqlServices.pool.query<RowDataPacket[0]>(`
      SELECT *
      FROM tb_product
    `);

    return Promise.resolve<ProductTy[]>(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProductById = async (id: string) => {
  try {
    const [rows] = await MysqlServices.pool.query<RowDataPacket[0]>(`SELECT * FROM tb_product WHERE tb_product.id = ?`, [id]);
    return Promise.resolve<ProductTy>(rows[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createProduct = async (item: ProductTy, images?: string) => {
  try {
    const [rows] = await MysqlServices.pool.query<OkPacket>(
      "INSERT INTO tb_product ( userId , title, metaTitle, price , discount , quantity ,category_id, images ,createdAt) VALUES (?,?,?,?,?,?,?,?,NOW())",
      [item.userId, item.title, item.metaTitle, item.price, item.discount, item.quantity, item.category_id, images]
    );
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProduct = async (item: ProductTy, images?: string, id?: string | number) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_product SET ? , images =? WHERE id = ?", [item, images, id]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeProduct = async (id: String) => {
  try {
    const [rows] = await MysqlServices.pool.query("DELETE FROM tb_product  WHERE id = ?", [id]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addProductCatagory = async (productId: number, productData: ProductTy) => {
  try {
    const [rows] = await MysqlServices.pool.query("INSERT INTO tb_product_category (product_id , category_id) VALUES (?,?)", [
      productId,
      productData.category_id,
    ]);
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};
