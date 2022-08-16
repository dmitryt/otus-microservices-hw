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