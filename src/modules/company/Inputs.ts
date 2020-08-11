import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';
import { Company } from '../../entity/Company';
import { IsUnique } from '../shared/uniqueValidation';

@InputType()
export class BaseCommpanyInput {
  @Field(() => GraphQLUpload, { nullable: true })
  logo?: Promise<FileUpload>;
}

@InputType()
export class CreateCompanyInput extends BaseCommpanyInput {
  @Field()
  @IsUnique(Company)
  title: string;
}

@InputType()
export class UpdateCompanyInput extends BaseCommpanyInput {
  @Field()
  title: string;
}
