export interface ProductTy {
  id: string;
  userId: string;
  title: string;
  metaTitle?: string;
  price: number;
  discount: number;
  quantity: number;
  category_id: number;
  images: string;
}

export interface ProductCartTy {
  id: string;
  userId: string;
  title: string;
  metaTitle?: string;
  price: number;
  discount: number;
  images: string;
  quantity: number;
  category_id: number;
  qty: number;
}
