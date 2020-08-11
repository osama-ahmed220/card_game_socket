import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { Arg, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { User } from '../../entity/User';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../shared/constants';
import { LoginInput, LoginResponse } from './Inputs';

@Resolver(User)
export class UserResolver {
  @FieldResolver()
  name(@Root() { firstName, lastName }: User): string {
    return `${firstName} ${lastName}`;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('data', () => LoginInput) { email, password }: LoginInput
  ): Promise<LoginResponse | Error> {
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
      expiresIn: '365 days',
    });
    const accessToken = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1m',
    });
    return {
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
      user,
    };
  }

  @Mutation(() => String)
  async refreshToken(
    @Arg('token', () => String) token: string
  ): Promise<string> {
    const decodedData = verify(token, REFRESH_TOKEN_SECRET);
    const userID = (decodedData as any).userId;
    const accessToken = sign({ userId: userID }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1m',
    });
    return accessToken;
  }
}
