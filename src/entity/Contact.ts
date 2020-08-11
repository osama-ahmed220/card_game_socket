import { BaseEntity } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

@ObjectType()
@InputType("ContactInput")
export class Contact extends BaseEntity {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  message: string;
}
