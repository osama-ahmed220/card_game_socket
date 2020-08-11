import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import { Company } from './Company';
import { Duration } from './interfaces/duration';
import { Project } from './Project';
import { Skill } from './Skill';

@ObjectType()
@Entity()
export class WorkExperience extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  @Index({ unique: true })
  title: string;

  @Field(() => Duration)
  @Column('simple-json')
  duration: Duration;

  @Column()
  companyID: string;

  @Field(() => Company)
  company: Company;

  @Field()
  @Column()
  description: string;

  @Field(() => [Project], { nullable: true })
  projects: Project[];

  @Field(() => [Skill])
  skills: Skill[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string;
}
