import Joi from 'joi';

export interface IUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export type IUserModel = IUserPayload & {
  id: string;
  username: string;
  password: string;
}

export interface IOrderPayload {
  items: {
    id: number;
    amount: number;
  }[]
}

const payload = {
  items: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    amount: Joi.number().required(),
  })).required(),
};

export const orderSchema = Joi.object({
  ...payload,
  id: Joi.number().required(),
  user_id: Joi.number().required(),
});

export const orderPayload = Joi.object(payload);
