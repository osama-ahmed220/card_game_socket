import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import { Project } from './Project';
import { Stack } from './Stack';

@ObjectType()
@Entity()
export class Skill extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  @Index({ unique: true })
  title: string;

  @Field()
  @Column()
  rating: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isMain?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isCategory?: true;

  @Field(() => [Stack])
  stacks: Stack[];

  @Field(() => [Project])
  projects: Project[];
}
