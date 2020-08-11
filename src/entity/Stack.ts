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

@ObjectType()
@Entity()
export class Stack extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  @Index({ unique: true })
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field(() => [Skill])
  skills: Skill[];
}
