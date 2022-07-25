import Joi from 'joi';

const phoneRegexp = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[-. \\/]?)?((?:\(?\d{1,}\)?[-. \\/]?){0,})(?:[-. \\/]?(?:#|ext\.?|extension|x)[-. \\/]?(\d+))?$/;

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

const payload = {
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2 }).message('Must be valid email'),
  phone: Joi.string().pattern(phoneRegexp).message('Must be valid phone')
};

export const userSchema = Joi.object({
  ...payload,
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const userPayload = Joi.object(payload);
