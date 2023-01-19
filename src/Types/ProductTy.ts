import * as Joi from "joi";

export interface ProductTy {
  id?: number;
  userId: string;
  title: string;
  metaTitle?: string;
  price: number;
  discount: number;
  quantity: number;
  category_id: number;
  image: string;
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
