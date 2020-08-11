import { Field, InputType } from 'type-graphql';

@InputType()
export class BaseProjectSkillInput {
  @Field(() => String)
  projectID: string;

  @Field(() => String)
  skillID: number;
}

@InputType()
export class CreateProjectSkillInput extends BaseProjectSkillInput {}

@InputType()
export class UpdateProjectSkillInput extends BaseProjectSkillInput {}
