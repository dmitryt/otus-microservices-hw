import Joi from 'joi';

const phoneRegexp = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[-. \\/]?)?((?:\(?\d{1,}\)?[-. \\/]?){0,})(?:[-. \\/]?(?:#|ext\.?|extension|x)[-. \\/]?(\d+))?$/;

export const newUserSchema = Joi.object({
  username: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  phone: Joi.string().pattern(phoneRegexp)
});

export const updateUserSchema = {
  type: 'object',
  properties: {
    hello: { type: 'string' }
  }
};