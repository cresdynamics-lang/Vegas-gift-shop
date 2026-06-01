import { Request } from 'express';

/** Express 5 may type `req.params.id` as `string | string[]`. */
export function paramId(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return '';
}
