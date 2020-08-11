import { IsNotEmpty } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';
import { Stack } from '../../entity/Stack';
import { SkillIDsInput } from '../shared/Inputs';
import { IsUnique } from '../shared/uniqueValidation';

@InputType()
export class BaseStackInput {
  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>;
}

@InputType()
export class CreateStackInput extends BaseStackInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUnique(Stack)
  title: string;
}

@InputType()
export class UpdateStackInput extends BaseStackInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;
}

@InputType()
export class AssignStackSkillsInput extends SkillIDsInput {
  @Field(() => String)
  stackID: string;
}

@InputType()
export class StackSkillsFilterInput {
  @Field({ nullable: true })
  isMain?: boolean;
}
