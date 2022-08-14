import { FastifySchema } from 'fastify';

const joiOptions = {
  abortEarly: false, // return all errors
  convert: true, // change data type of data to match type keyword
  allowUnknown: false, // remove additional properties
  noDefaults: false,
};

const compiler = ({ schema }: { schema: FastifySchema}) =>
  // @ts-ignore
   (data: any) => schema.validate(data, joiOptions)
;

export default compiler;