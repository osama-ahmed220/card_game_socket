import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Skill } from '../../entity/Skill';
import { IsUnique } from '../shared/uniqueValidation';

@InputType()
export class BaseSkillInput {
  @Field({ defaultValue: 0 })
  rating: number = 0;

  @Field({ nullable: true })
  isMain?: boolean;

  @Field({ nullable: true })
  isCategory?: boolean;
}
@InputType()
export class CreateSkillInput extends BaseSkillInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUnique(Skill)
  title: string;
}
@InputType()
export class UpdateSkillInput extends BaseSkillInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;
}

@InputType()
export class AssignSkillStacksInput {
  @Field(() => String)
  skillID: string;

  @Field(() => [String])
  stackIDs: string[];
}
