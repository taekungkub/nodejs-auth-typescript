import * as Joi from "joi";

export type ProductTy = {
  id?: number;
  userId: string;
  title: string;
  metaTitle?: string;
  price: number;
  discount: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
};

export const ProductSchemaBody = Joi.object<ProductTy>({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  metaTitle: Joi.string(),
  price: Joi.number().required(),
  discount: Joi.number().required(),
  quantity: Joi.number().required(),
  createdAt: Joi.string(),
  updatedAt: Joi.string(),
});