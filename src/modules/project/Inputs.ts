import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';
import { Project } from '../../entity/Project';
import { SkillIDsInput } from '../shared/Inputs';
import { IsUnique } from '../shared/uniqueValidation';

@InputType()
export class BaseProjectInput {
  @Field()
  description: string;

  @Field(() => [String], { nullable: true })
  description_point?: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>;

  @Field({ nullable: true })
  tagLine?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  completionTime?: string;

  @Field({ nullable: true })
  sourceCode?: string;

  @Field()
  weID: string;

  @Field({ nullable: true })
  isFeatured: boolean;
}
@InputType()
export class CreateProjectInput extends BaseProjectInput {
  @Field()
  @IsUnique(Project)
  title: string;
}
@InputType()
export class UpdateProjectInput extends BaseProjectInput {
  @Field()
  title: string;
}

@InputType()
export class AssignProjectSkillsInput extends SkillIDsInput {
  @Field(() => String)
  projectID: string;
}
