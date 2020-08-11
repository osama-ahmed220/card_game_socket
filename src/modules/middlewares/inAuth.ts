import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import MyContext from '../../interfaces/MyContext';
import { ACCESS_TOKEN_SECRET } from '../shared/constants';

const isAuth: MiddlewareFn<MyContext> = async ({ context: { req } }, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return new Error('Not authenticated');
  }
  verify(token.split('Bearer ')[1], ACCESS_TOKEN_SECRET);
  return next();
};

export default isAuth;
