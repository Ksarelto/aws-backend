import Joi from "joi";

export const productRequestSchema = Joi.object({
    count: Joi.number().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    title: Joi.string().required(),
    imageUrl: Joi.string()
  })
