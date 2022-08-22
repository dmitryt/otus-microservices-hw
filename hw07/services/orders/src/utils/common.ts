import crypto from 'crypto';
import stringify from 'fast-json-stable-stringify';

export const hash = (d: object) => {
  const buffer = Buffer.from(stringify(d));
  return crypto.createHash('sha256').update(buffer).digest('hex');
}