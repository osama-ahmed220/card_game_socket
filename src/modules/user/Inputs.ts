import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from '../../entity/User';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class TokenObject {
  @Field()
  access: string;

  @Field()
  refresh: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  tokens: TokenObject;

  @Field()
  user: User;
}
