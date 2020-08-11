import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Duration } from '../../entity/interfaces/duration';
import { WorkExperience } from '../../entity/WorkExperience';
import { SkillIDsInput } from '../shared/Inputs';
import { IsUnique } from '../shared/uniqueValidation';

@InputType()
export class BaseWorkExperienceInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUnique(WorkExperience)
  title: string;

  @Field()
  @IsNotEmpty()
  duration: Duration;

  @Field()
  @IsNotEmpty()
  companyID: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class CreateWorkExperienceInput extends BaseWorkExperienceInput {}

@InputType()
export class UpdateWorkExperienceInput extends BaseWorkExperienceInput {}

@InputType()
export class AssignWorkExperienceSkillsInput extends SkillIDsInput {
  @Field(() => String)
  weID: string;
}
