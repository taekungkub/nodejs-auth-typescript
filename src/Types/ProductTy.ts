import * as Joi from "joi";

export interface ProductTy {
  id: string;
  userId: string;
  title: string;
  metaTitle?: string;
  price: number;
  discount: number;
  quantity: number;
  category_id: number;
  image: string;
}

export interface ProductCartTy {
  id: string;
  userId: string;
  title: string;
  metaTitle?: string;
  price: number;
  discount: number;
  image: string;
  quantity: number;
  category_id: number;
  qty: number;
}

export const ProductSchemaBody = Joi.object<ProductTy>({
  id: Joi.allow(),
  userId: Joi.string().required(),
  title: Joi.string().required(),
  metaTitle: Joi.string(),
  price: Joi.number().required(),
  discount: Joi.number().required(),
  quantity: Joi.number().required(),
  image: Joi.allow(),
  category_id: Joi.number().required(),
});
