import { Field, InputType } from 'type-graphql';

@InputType()
export class BaseWorkExperienceSkillInput {
  @Field(() => String)
  weID: string;

  @Field(() => String)
  skillID: number;
}

@InputType()
export class CreateWorkExperienceSkillInput extends BaseWorkExperienceSkillInput {}

@InputType()
export class UpdateWorkExperienceSkillInput extends BaseWorkExperienceSkillInput {}
