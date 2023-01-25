export interface OrderTy {
  id: string;
  user_id: string;
  status: string;
  payment: string;
  total: string;
  products: Array<OrderProductTy>;
}

export interface OrderProductTy {
  id: string;
  order_id: string | number;
  product_id: string | number;
  quantity: number;
}
