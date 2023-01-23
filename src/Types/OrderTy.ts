export interface OrderTy {
  id?: string;
  user_id: string;
  status: string;
  payment: string;
}



export interface OrderProductTy {
  id?:string,
  order_id: string|number;
  product_id: string|number;
  quantity : number;
}