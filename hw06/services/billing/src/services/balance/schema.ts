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

export interface IBalancePayload {
  amount: number;
}

export type IBalanceModel = IBalancePayload & {
  id: string;
  user_id: number;
}

const payload = {
  amount: Joi.number(),
};

export const balanceSchema = Joi.object({
  ...payload,
  id: Joi.number().required(),
  user_id: Joi.number().required(),
});

export const balancePayload = Joi.object(payload);
