import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import { Skill } from './Skill';
import { WorkExperience } from './WorkExperience';

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  @Index({ unique: true })
  title: string;

  @Field()
  @Column()
  description: string;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  description_point?: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tagLine?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  completionTime?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  sourceCode?: string;

  @Field(() => [Skill])
  skills: Skill[];

  @Column()
  weID: string;

  @Field(() => WorkExperience, { nullable: true })
  work_experience?: WorkExperience | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isFeatured: boolean;
}
