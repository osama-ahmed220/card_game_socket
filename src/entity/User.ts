import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  @Index({ unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  password: string;
}
