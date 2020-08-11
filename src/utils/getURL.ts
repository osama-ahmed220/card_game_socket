import { Request } from 'express';

export default (req: Request) => {
  return `${req.protocol}://${req.get('host')}`;
};
