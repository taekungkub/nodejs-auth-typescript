import { MysqlServices } from "../../config/mysqlService";
import { OrderProductTy, OrderTy } from "../../types/OrderTy";

export const getOrders = async () => {
  try {
    const [rows] = await MysqlServices.pool.query(`
      SELECT * FROM tb_order 
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
      `
      SELECT * FROM tb_order
      WHERE tb_order.id = ?
      `,
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

export const getOrderProduct = async (orderId: string | number) => {
  try {
    const [rows] = (await MysqlServices.pool.query(
      `
      SELECT op.product_id, op.quantity, p.title, p.price
      FROM tb_order_product op
      LEFT OUTER JOIN tb_product p
      ON op.product_id = p.id
      WHERE op.order_id = ?
      `,
      [orderId]
    )) as Array<any>;

    if (rows.length === 0) {
      return Promise.reject("Order Product not found");
    }

    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOrderUser = async (userId: string | number) => {
  try {
    const [rows] = (await MysqlServices.pool.query(
      `
      SELECT * FROM tb_order
      WHERE tb_order.user_id = ?
      `,
      [userId]
    )) as Array<any>;

    if (rows.length === 0) {
      return Promise.reject("Order User not found");
    }

    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createOrder = async (item: OrderTy) => {
  try {
    const [rows] = (await MysqlServices.pool.query(
      "INSERT INTO tb_order ( user_id , status, payment, total,createdAt) VALUES (?,?,?,?,NOW())",
      [item.user_id, item.status, item.payment, item.total]
    )) as Array<any>;
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createOrderProduct = async (orderId: string | number, productId: string | number, qty: number) => {
  try {
    const [rows] = await MysqlServices.pool.query(
      "INSERT INTO tb_order_product ( order_id , product_id ,  quantity , createdAt ) VALUES (?,?,?,NOW())",
      [orderId, productId, qty]
    );
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateOrder = async (item: OrderTy, id: string) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_order SET ?  WHERE id = ?", [item, id]);
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

export const updateQuantity = async (id: string | number, quantity: number) => {
  try {
    const [rows] = await MysqlServices.pool.query("UPDATE tb_product SET quantity = quantity + ?  WHERE id = ?", [quantity, id]);
    if (rows) {
      return Promise.resolve(rows);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
