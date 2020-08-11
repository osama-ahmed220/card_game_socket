import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { RefreshToken } from '../../entity/RefreshToken';
import { User } from '../../entity/User';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../../modules/shared/constants';

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenObject {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  error?: Error;
  tokens?: TokenObject;
  user?: User;
}

export default class UserController {
  async login({ email, password }: LoginInput): Promise<LoginResponse | Error> {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return new Error('User not found.');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Error('Password is wrong.');
    }
    const refreshToken = sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
    const accessToken = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: 2 * 60000,
    });
    await RefreshToken.create({
      token: refreshToken,
    }).save();
    return {
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
      user,
    };
  }
}
