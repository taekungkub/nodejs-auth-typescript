import { MysqlServices } from "../../config/mysqlService";
import { OrderProductTy, OrderTy } from "../../Types/OrderTy";

export const getOrders = async () => {
  try {
    const [rows] = await MysqlServices.pool.query(`
      SELECT *
      FROM tb_order
    `);

    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOrder = async (id: string) => {
  try {
    const [rows] = (await MysqlServices.pool.query(
      `SELECT * FROM tb_order 
        WHERE tb_order.id = ?`,
      [id]
    )) as Array<any>;

    if (rows.length === 0) {
      return Promise.reject("Order not found");
    }

    return Promise.resolve(rows[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createOrder = async (item: OrderTy) => {
  try {
    const [rows] = await MysqlServices.pool.query("INSERT INTO tb_order ( user_id , status, payment, createdAt) VALUES (?,?,?,NOW())", [
      item.user_id,
      item.status,
      item.payment,
    ]) as Array<any>
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createOrderProduct = async (item: OrderProductTy ) => {
  try {
    const [rows] = await MysqlServices.pool.query("INSERT INTO tb_order ( order_id , product_id ,  quantity , createdAt ) VALUES (?,?,?,NOW())", [
      item.order_id,
      item.product_id,
      item.quantity,
    ]);
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};


export const updateOrder = async (item: OrderTy, id: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_order SET ? , WHERE id = ?", [item, id]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeOrder = async (id: String) => {
  try {
    const [rows] = await MysqlServices.pool.query("DELETE FROM tb_order  WHERE id = ?", [id]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
