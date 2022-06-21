import Joi from 'joi';

const phoneRegexp = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[-. \\/]?)?((?:\(?\d{1,}\)?[-. \\/]?){0,})(?:[-. \\/]?(?:#|ext\.?|extension|x)[-. \\/]?(\d+))?$/;

const payload = {
  username: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email({ minDomainSegments: 2 }).message('Must be valid email'),
  phone: Joi.string().pattern(phoneRegexp).message('Must be valid phone')
};

const userSchema = Joi.object(payload);
export default userSchema;
