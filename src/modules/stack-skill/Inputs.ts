import { Field, InputType } from 'type-graphql';

@InputType()
export class BaseStackSkillInput {
  @Field(() => String)
  stackID: string;

  @Field(() => String)
  skillID: number;
}

@InputType()
export class CreateStackSkillInput extends BaseStackSkillInput {}

@InputType()
export class UpdateStackSkillInput extends BaseStackSkillInput {}
