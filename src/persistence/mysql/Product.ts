import { MysqlServices } from "../../config/mysqlService";
import { ProductTy } from "../../Types/ProductTy";

export const getProducts = async () => {
  try {
    // const [rows] = await conn.query("SELECT * FROM tb_product");
    const [rows] = await MysqlServices.pool.query(`
      SELECT *
      FROM tb_product
    `);

    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProduct = async (id: string) => {
  try {
    const [rows] = (await MysqlServices.pool.query(
      `SELECT * FROM tb_product 
        WHERE tb_product.id = ?`,
      [id]
    )) as Array<any>;

    if (rows.length === 0) {
      return Promise.reject("Product not found");
    }

    return Promise.resolve(rows[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createProduct = async (item: ProductTy, image?: string) => {
  try {
    const [rows] = await MysqlServices.pool.query(
      "INSERT INTO tb_product ( userId , title, metaTitle, price , discount , quantity ,category_id, image ,createdAt) VALUES (?,?,?,?,?,?,?,?,NOW())",
      [item.userId, item.title, item.metaTitle, item.price, item.discount, item.quantity, item.category_id, image]
    );
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProduct = async (item: ProductTy, imageName?: string | null, id?: string | number) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_product SET ? , image =? WHERE id = ?", [item, imageName, id]);
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
